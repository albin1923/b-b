import { Redis } from '@upstash/redis'

const DEFAULTS = {
  windowSeconds: 15 * 60,
  maxAttempts: 8,
  failureWindowSeconds: 24 * 60 * 60,
  captchaAfterFailures: 3,
  lockoutAfterFailures: 5,
  lockoutBaseSeconds: 30,
  lockoutMaxSeconds: 15 * 60,
}

const memoryStore = new Map()

let cachedRedisClient
let loggedRedisWarning = false

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }

  return parsed
}

function getConfig() {
  return {
    windowSeconds: parsePositiveInt(process.env.LOGIN_RATE_LIMIT_WINDOW_SECONDS, DEFAULTS.windowSeconds),
    maxAttempts: parsePositiveInt(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS, DEFAULTS.maxAttempts),
    failureWindowSeconds: parsePositiveInt(
      process.env.LOGIN_FAILURE_WINDOW_SECONDS,
      DEFAULTS.failureWindowSeconds
    ),
    captchaAfterFailures: parsePositiveInt(
      process.env.LOGIN_CAPTCHA_AFTER_FAILURES,
      DEFAULTS.captchaAfterFailures
    ),
    lockoutAfterFailures: parsePositiveInt(
      process.env.LOGIN_LOCKOUT_AFTER_FAILURES,
      DEFAULTS.lockoutAfterFailures
    ),
    lockoutBaseSeconds: parsePositiveInt(
      process.env.LOGIN_LOCKOUT_BASE_SECONDS,
      DEFAULTS.lockoutBaseSeconds
    ),
    lockoutMaxSeconds: parsePositiveInt(process.env.LOGIN_LOCKOUT_MAX_SECONDS, DEFAULTS.lockoutMaxSeconds),
  }
}

function getRedisClient() {
  if (cachedRedisClient !== undefined) {
    return cachedRedisClient
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    cachedRedisClient = null
    return cachedRedisClient
  }

  cachedRedisClient = new Redis({
    url,
    token,
  })

  return cachedRedisClient
}

function handleRedisFailure(error) {
  if (!loggedRedisWarning) {
    loggedRedisWarning = true
    console.error('Redis rate limiter unavailable; falling back to in-memory limiter.', error)
  }

  cachedRedisClient = null
}

function getMemoryEntry(key) {
  const entry = memoryStore.get(key)

  if (!entry) {
    return null
  }

  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(key)
    return null
  }

  return entry
}

function setMemoryEntry(key, value, ttlSeconds) {
  const now = Date.now()
  memoryStore.set(key, {
    value,
    expiresAt: now + ttlSeconds * 1000,
  })
}

function deleteMemoryEntries(keys) {
  for (const key of keys) {
    memoryStore.delete(key)
  }
}

async function getValue(key) {
  const redis = getRedisClient()

  if (redis) {
    try {
      const [value, ttlSeconds] = await Promise.all([redis.get(key), redis.ttl(key)])
      return {
        value: value == null ? null : String(value),
        ttlSeconds: Number(ttlSeconds) > 0 ? Number(ttlSeconds) : 0,
      }
    } catch (error) {
      handleRedisFailure(error)
    }
  }

  const entry = getMemoryEntry(key)
  if (!entry) {
    return { value: null, ttlSeconds: 0 }
  }

  return {
    value: String(entry.value),
    ttlSeconds: Math.max(1, Math.ceil((entry.expiresAt - Date.now()) / 1000)),
  }
}

async function setValue(key, value, ttlSeconds) {
  const redis = getRedisClient()

  if (redis) {
    try {
      await redis.set(key, String(value), { ex: ttlSeconds })
      return
    } catch (error) {
      handleRedisFailure(error)
    }
  }

  setMemoryEntry(key, String(value), ttlSeconds)
}

async function incrementValue(key, ttlSeconds) {
  const redis = getRedisClient()

  if (redis) {
    try {
      const count = Number(await redis.incr(key))

      if (count === 1) {
        await redis.expire(key, ttlSeconds)
      }

      const ttl = Number(await redis.ttl(key))
      return {
        count,
        ttlSeconds: ttl > 0 ? ttl : ttlSeconds,
      }
    } catch (error) {
      handleRedisFailure(error)
    }
  }

  const existingEntry = getMemoryEntry(key)
  const currentCount = existingEntry ? Number(existingEntry.value) || 0 : 0
  const nextCount = currentCount + 1

  if (existingEntry) {
    memoryStore.set(key, {
      value: nextCount,
      expiresAt: existingEntry.expiresAt,
    })

    return {
      count: nextCount,
      ttlSeconds: Math.max(1, Math.ceil((existingEntry.expiresAt - Date.now()) / 1000)),
    }
  }

  setMemoryEntry(key, nextCount, ttlSeconds)
  return {
    count: nextCount,
    ttlSeconds,
  }
}

async function deleteValues(keys) {
  const redis = getRedisClient()

  if (redis) {
    try {
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      return
    } catch (error) {
      handleRedisFailure(error)
    }
  }

  deleteMemoryEntries(keys)
}

function buildKeys(clientKey) {
  return {
    attempts: `admin-login:attempts:${clientKey}`,
    failures: `admin-login:failures:${clientKey}`,
    lockout: `admin-login:lockout:${clientKey}`,
  }
}

function shouldRequireCaptcha(failureCount, config) {
  return failureCount >= config.captchaAfterFailures
}

function calculateLockoutSeconds(failureCount, config) {
  if (failureCount < config.lockoutAfterFailures) {
    return 0
  }

  const escalationStep = Math.min(failureCount - config.lockoutAfterFailures, 5)
  const rawSeconds = config.lockoutBaseSeconds * 2 ** escalationStep
  return Math.min(rawSeconds, config.lockoutMaxSeconds)
}

export async function evaluateLoginAttempt(clientKey) {
  const config = getConfig()
  const keys = buildKeys(clientKey)

  const lockoutState = await getValue(keys.lockout)
  if (lockoutState.value) {
    const unlockAtMs = Number(lockoutState.value)

    if (Number.isFinite(unlockAtMs) && unlockAtMs > Date.now()) {
      const retryAfterSeconds = lockoutState.ttlSeconds
        ? lockoutState.ttlSeconds
        : Math.max(1, Math.ceil((unlockAtMs - Date.now()) / 1000))

      return {
        allowed: false,
        reason: 'lockout',
        retryAfterSeconds,
        captchaRequired: true,
      }
    }
  }

  const attemptState = await incrementValue(keys.attempts, config.windowSeconds)
  if (attemptState.count > config.maxAttempts) {
    return {
      allowed: false,
      reason: 'rate-limit',
      retryAfterSeconds: Math.max(1, attemptState.ttlSeconds),
      captchaRequired: false,
    }
  }

  const failureState = await getValue(keys.failures)
  const failureCount = Number(failureState.value) || 0

  return {
    allowed: true,
    reason: 'ok',
    retryAfterSeconds: 0,
    captchaRequired: shouldRequireCaptcha(failureCount, config),
  }
}

export async function registerFailedLogin(clientKey) {
  const config = getConfig()
  const keys = buildKeys(clientKey)
  const failureState = await incrementValue(keys.failures, config.failureWindowSeconds)
  const failureCount = failureState.count
  const captchaRequired = shouldRequireCaptcha(failureCount, config)
  const lockoutSeconds = calculateLockoutSeconds(failureCount, config)

  if (lockoutSeconds > 0) {
    const unlockAtMs = Date.now() + lockoutSeconds * 1000
    await setValue(keys.lockout, String(unlockAtMs), lockoutSeconds)
  }

  return {
    failureCount,
    captchaRequired,
    locked: lockoutSeconds > 0,
    retryAfterSeconds: lockoutSeconds,
  }
}

export async function clearLoginGuardState(clientKey) {
  const keys = buildKeys(clientKey)
  await deleteValues([keys.attempts, keys.failures, keys.lockout])
}
