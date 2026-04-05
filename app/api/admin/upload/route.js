import { NextResponse } from 'next/server'
import { requireAdminSession } from '../../../../src/lib/auth'
import { uploadImageFile } from '../../../../src/lib/media-store'

export const runtime = 'nodejs'

export async function POST(request) {
  const session = await requireAdminSession(request, { requireCsrf: true })
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  let formData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form payload' }, { status: 400 })
  }

  const file = formData.get('file')
  const folder = String(formData.get('folder') || 'general')

  if (!file || typeof file.arrayBuffer !== 'function') {
    return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
  }

  try {
    const uploaded = await uploadImageFile(file, { folder })
    return NextResponse.json({ url: uploaded.url }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 400 }
    )
  }
}
