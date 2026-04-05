import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { AUTH_COOKIE_NAME } from './src/lib/auth-constants'
import { getJwtSecret } from './src/lib/security-env'

const encoder = new TextEncoder()

function getJwtSecretBytes() {
  try {
    return encoder.encode(getJwtSecret())
  } catch {
    return null
  }
}

async function isValidAdminToken(token) {
  const secret = getJwtSecretBytes()

  if (!token || !secret) {
    return false
  }

  try {
    const result = await jwtVerify(token, secret)
    return result.payload.role === 'admin'
  } catch {
    return false
  }
}

function buildCsp() {
  const isDev = process.env.NODE_ENV !== 'production'
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'"

  const directives = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-src 'self' https://www.google.com https://www.google.com/maps",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ]

  if (!isDev) {
    directives.push('upgrade-insecure-requests')
  }

  return directives.join('; ')
}

function applySecurityHeaders(response) {
  response.headers.set('Content-Security-Policy', buildCsp())
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  return response
}

function unauthorizedApiResponse() {
  return applySecurityHeaders(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isLoginPage = pathname === '/admin/login'
  const isLoginApi = pathname === '/api/admin/login'
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value

  if ((isAdminPage && !isLoginPage) || (isAdminApi && !isLoginApi)) {
    const authorized = await isValidAdminToken(authToken)

    if (!authorized) {
      if (isAdminApi) {
        return unauthorizedApiResponse()
      }

      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      loginUrl.searchParams.set('next', pathname)

      return applySecurityHeaders(NextResponse.redirect(loginUrl))
    }
  }

  if (isLoginPage) {
    const authorized = await isValidAdminToken(authToken)
    if (authorized) {
      const adminUrl = request.nextUrl.clone()
      adminUrl.pathname = '/admin'
      return applySecurityHeaders(NextResponse.redirect(adminUrl))
    }
  }

  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
