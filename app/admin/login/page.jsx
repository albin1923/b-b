'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

function getTurnstileApi() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.turnstile || null
}

function ensureTurnstileScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  if (window.turnstile) {
    return Promise.resolve(window.turnstile)
  }

  return new Promise((resolve) => {
    const existingScript = document.getElementById('turnstile-script')
    if (existingScript) {
      existingScript.addEventListener(
        'load',
        () => {
          resolve(window.turnstile || null)
        },
        { once: true }
      )
      return
    }

    const script = document.createElement('script')
    script.id = 'turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.turnstile || null)
    script.onerror = () => resolve(null)
    document.head.append(script)
  })
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [nextPath, setNextPath] = useState('/admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaRequired, setCaptchaRequired] = useState(false)
  const [captchaSiteKey, setCaptchaSiteKey] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaContainerRef = useRef(null)
  const captchaWidgetIdRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedPath = params.get('next')

    if (requestedPath && requestedPath.startsWith('/admin')) {
      setNextPath(requestedPath)
    }
  }, [])

  useEffect(() => {
    let active = true

    async function checkSession() {
      const response = await fetch('/api/admin/session', {
        credentials: 'include',
        cache: 'no-store',
      })

      if (active && response.ok) {
        router.replace('/admin')
      }
    }

    checkSession()
    return () => {
      active = false
    }
  }, [router])

  useEffect(() => {
    if (!captchaRequired || !captchaSiteKey) {
      return undefined
    }

    let active = true

    async function mountCaptcha() {
      const turnstile = await ensureTurnstileScript()

      if (!active || !turnstile || !captchaContainerRef.current || captchaWidgetIdRef.current != null) {
        return
      }

      captchaWidgetIdRef.current = turnstile.render(captchaContainerRef.current, {
        sitekey: captchaSiteKey,
        callback: (token) => {
          if (active) {
            setCaptchaToken(token)
          }
        },
        'expired-callback': () => {
          if (active) {
            setCaptchaToken('')
          }
        },
        'error-callback': () => {
          if (active) {
            setCaptchaToken('')
          }
        },
      })
    }

    mountCaptcha()

    return () => {
      active = false
    }
  }, [captchaRequired, captchaSiteKey])

  useEffect(() => {
    if (captchaRequired) {
      return
    }

    setCaptchaToken('')
    const turnstile = getTurnstileApi()

    if (turnstile && captchaWidgetIdRef.current != null) {
      turnstile.remove(captchaWidgetIdRef.current)
      captchaWidgetIdRef.current = null
    }
  }, [captchaRequired])

  const resetCaptcha = () => {
    setCaptchaToken('')
    const turnstile = getTurnstileApi()

    if (turnstile && captchaWidgetIdRef.current != null) {
      turnstile.reset(captchaWidgetIdRef.current)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
          captchaToken: captchaRequired ? captchaToken : undefined,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (data.captchaRequired) {
          setCaptchaRequired(true)
          if (typeof data.captchaSiteKey === 'string' && data.captchaSiteKey) {
            setCaptchaSiteKey(data.captchaSiteKey)
          }
          resetCaptcha()
        }

        const retryHint =
          typeof data.retryAfterSeconds === 'number' && data.retryAfterSeconds > 0
            ? ` Please try again in ${data.retryAfterSeconds}s.`
            : ''

        throw new Error(`${data.error || 'Login failed'}${retryHint}`)
      }

      setCaptchaRequired(false)
      setCaptchaSiteKey('')
      setCaptchaToken('')

      router.replace(nextPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginPanel}>
        <p className={styles.eyebrow}>B&B Apartments</p>
        <h1 className={styles.title}>Admin CMS</h1>
        <p className={styles.subtitle}>Sign in to manage News and Gallery content</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {captchaRequired && (
            <div className={styles.captchaField}>
              <span>Security check required</span>
              <div ref={captchaContainerRef} />
              {!captchaToken && <p className={styles.captchaHint}>Complete the CAPTCHA to continue.</p>}
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || (captchaRequired && !captchaToken)}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}
