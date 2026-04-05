import { getTurnstileConfig } from './security-env'

export function getCaptchaChallengeConfig() {
  const turnstile = getTurnstileConfig()

  if (!turnstile) {
    return {
      enabled: false,
      provider: null,
      siteKey: null,
    }
  }

  return {
    enabled: true,
    provider: 'turnstile',
    siteKey: turnstile.siteKey,
  }
}

export async function verifyCaptchaToken({ token, clientIp }) {
  const turnstile = getTurnstileConfig()

  if (!turnstile) {
    return { enabled: false, valid: true }
  }

  if (!token || typeof token !== 'string') {
    return { enabled: true, valid: false }
  }

  const payload = new URLSearchParams()
  payload.set('secret', turnstile.secretKey)
  payload.set('response', token)

  if (clientIp && clientIp !== 'unknown') {
    payload.set('remoteip', clientIp)
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
      cache: 'no-store',
    })

    if (!response.ok) {
      return { enabled: true, valid: false }
    }

    const data = await response.json()
    return { enabled: true, valid: Boolean(data?.success) }
  } catch {
    return { enabled: true, valid: false }
  }
}