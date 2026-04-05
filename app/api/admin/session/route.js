import { NextResponse } from 'next/server'
import { getJwtConfigurationError, requireAdminSession } from '../../../../src/lib/auth'

export const runtime = 'nodejs'

export async function GET(request) {
  const jwtConfigError = getJwtConfigurationError()
  if (jwtConfigError) {
    return NextResponse.json(
      {
        authenticated: false,
        error: `Admin auth is misconfigured: ${jwtConfigError}`,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  const session = await requireAdminSession(request)

  if (!session.ok) {
    return NextResponse.json(
      { authenticated: false },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  return NextResponse.json(
    {
      authenticated: true,
      username: session.payload.sub,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
