import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createAuthToken,
  createCsrfToken,
  getJwtConfigurationError,
  isAdminAuthConfigured,
  setAuthCookies,
  verifyAdminCredentials,
} from '../../../../src/lib/auth'
import {
  clearLoginGuardState,
  evaluateLoginAttempt,
  registerFailedLogin,
} from '../../../../src/lib/rate-limit'
import { getCaptchaChallengeConfig, verifyCaptchaToken } from '../../../../src/lib/captcha'

const loginSchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(8).max(200),
  captchaToken: z.string().trim().max(4096).optional(),
})

function getClientKey(request) {
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp.trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return 'unknown'
}

function buildAuthErrorResponse(message, { status, retryAfterSeconds = 0, captchaRequired = false } = {}) {
  const captcha = getCaptchaChallengeConfig()
  const payload = {
    error: message,
  }

  if (retryAfterSeconds > 0) {
    payload.retryAfterSeconds = retryAfterSeconds
  }

  if (captchaRequired && captcha.enabled) {
    payload.captchaRequired = true
    payload.captchaProvider = captcha.provider
    payload.captchaSiteKey = captcha.siteKey
  }

  return NextResponse.json(payload, {
    status,
    headers: retryAfterSeconds
      ? {
          'Retry-After': String(retryAfterSeconds),
        }
      : undefined,
  })
}

export const runtime = 'nodejs'

export async function POST(request) {
  const jwtConfigError = getJwtConfigurationError()
  if (jwtConfigError) {
    return NextResponse.json(
      {
        error: `Admin auth is misconfigured: ${jwtConfigError}`,
      },
      { status: 500 }
    )
  }

  const clientKey = getClientKey(request)
  const guard = await evaluateLoginAttempt(clientKey)

  if (!guard.allowed && guard.reason === 'rate-limit') {
    return buildAuthErrorResponse('Too many login attempts. Try again later.', {
      status: 429,
      retryAfterSeconds: guard.retryAfterSeconds,
    })
  }

  if (!guard.allowed && guard.reason === 'lockout') {
    return buildAuthErrorResponse('Too many failed attempts. Account access is temporarily locked.', {
      status: 429,
      retryAfterSeconds: guard.retryAfterSeconds,
      captchaRequired: true,
    })
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          'Admin auth is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH in environment variables.',
      },
      { status: 500 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    const failureState = await registerFailedLogin(clientKey)
    return buildAuthErrorResponse('Invalid username or password format', {
      status: 400,
      retryAfterSeconds: failureState.retryAfterSeconds,
      captchaRequired: failureState.captchaRequired,
    })
  }

  if (guard.captchaRequired) {
    const captchaCheck = await verifyCaptchaToken({
      token: parsed.data.captchaToken,
      clientIp: clientKey,
    })

    if (!captchaCheck.valid) {
      const failureState = await registerFailedLogin(clientKey)
      return buildAuthErrorResponse('CAPTCHA verification failed. Try again.', {
        status: 400,
        retryAfterSeconds: failureState.retryAfterSeconds,
        captchaRequired: true,
      })
    }
  }

  const isValid = await verifyAdminCredentials(parsed.data.username, parsed.data.password)
  if (!isValid) {
    const failureState = await registerFailedLogin(clientKey)
    return buildAuthErrorResponse('Invalid username or password', {
      status: 401,
      retryAfterSeconds: failureState.retryAfterSeconds,
      captchaRequired: failureState.captchaRequired,
    })
  }

  await clearLoginGuardState(clientKey)

  const token = await createAuthToken(parsed.data.username)
  const csrfToken = createCsrfToken()

  const response = NextResponse.json(
    { ok: true },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )

  setAuthCookies(response, { token, csrfToken })
  return response
}
