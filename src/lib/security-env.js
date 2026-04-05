const LOCAL_DEV_JWT_SECRET = 'local-dev-jwt-secret-change-me'
const MIN_JWT_SECRET_LENGTH = 32

let hasValidatedSecurityEnvironment = false

function isPlaceholderSecret(value) {
  const normalized = value.toLowerCase()
  return (
    normalized.includes('change-me') ||
    normalized.includes('replace') ||
    normalized.includes('example') ||
    normalized.includes('placeholder')
  )
}

export function isLocalDevelopment() {
  return process.env.NODE_ENV === 'development'
}

export function isStrongJwtSecret(secret) {
  if (!secret) {
    return false
  }

  return secret.length >= MIN_JWT_SECRET_LENGTH && !isPlaceholderSecret(secret)
}

export function getJwtSecret() {
  const configuredSecret = process.env.JWT_SECRET?.trim()

  if (configuredSecret) {
    if (!isStrongJwtSecret(configuredSecret)) {
      throw new Error(
        `JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters and must not use a placeholder value.`
      )
    }

    return configuredSecret
  }

  if (isLocalDevelopment()) {
    return LOCAL_DEV_JWT_SECRET
  }

  throw new Error('JWT_SECRET must be configured outside local development.')
}

export function validateSecurityEnvironment() {
  if (hasValidatedSecurityEnvironment) {
    return
  }

  getJwtSecret()

  if (!isLocalDevelopment()) {
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH) {
      throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD_HASH are required outside local development.')
    }
  }

  hasValidatedSecurityEnvironment = true
}

export function getTurnstileConfig() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim()

  if (!siteKey || !secretKey) {
    return null
  }

  return {
    siteKey,
    secretKey,
  }
}