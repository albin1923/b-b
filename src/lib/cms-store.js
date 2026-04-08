import path from 'node:path'
import crypto from 'node:crypto'
import { promises as fs } from 'node:fs'
import { list, put } from '@vercel/blob'
import { buildDefaultCmsData } from './cms-defaults'

const LOCAL_DATA_DIR = path.join(process.cwd(), 'data')
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'cms.json')
const BLOB_PREFIX = 'cms/content/'

let cachedBlobUrl = null

function nowIso() {
  return new Date().toISOString()
}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(buildDefaultCmsData()))
}

function normalizeNewsItem(item) {
  const createdAt = item.createdAt || nowIso()
  const updatedAt = item.updatedAt || createdAt
  return {
    id: item.id || crypto.randomUUID(),
    title: String(item.title || '').trim(),
    date: String(item.date || '').trim(),
    excerpt: String(item.excerpt || '').trim(),
    content: String(item.content || '').trim(),
    imageUrl: String(item.imageUrl || '').trim(),
    published: Boolean(item.published),
    createdAt,
    updatedAt,
  }
}

function normalizeGalleryItem(item) {
  const createdAt = item.createdAt || nowIso()
  const updatedAt = item.updatedAt || createdAt
  const layout = ['normal', 'large', 'tall'].includes(item.layout) ? item.layout : 'normal'
  return {
    id: item.id || crypto.randomUUID(),
    title: String(item.title || '').trim(),
    alt: String(item.alt || '').trim(),
    category: String(item.category || '').trim(),
    caption: String(item.caption || '').trim(),
    imageUrl: String(item.imageUrl || '').trim(),
    layout,
    visible: item.visible !== false,
    featured: Boolean(item.featured),
    createdAt,
    updatedAt,
  }
}

function normalizeCmsData(raw) {
  const base = raw && typeof raw === 'object' ? raw : {}
  const defaults = cloneDefaults()
  const news = Array.isArray(base.news) ? base.news : defaults.news
  const gallery = Array.isArray(base.gallery) ? base.gallery : defaults.gallery

  return {
    news: news.map(normalizeNewsItem),
    gallery: gallery.map(normalizeGalleryItem),
  }
}

async function ensureLocalFile() {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true })
  try {
    await fs.access(LOCAL_DATA_FILE)
  } catch {
    await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(cloneDefaults(), null, 2), 'utf8')
  }
}

async function readLocalData() {
  await ensureLocalFile()
  const file = await fs.readFile(LOCAL_DATA_FILE, 'utf8')
  const parsed = JSON.parse(file)
  return normalizeCmsData(parsed)
}

async function writeLocalData(data) {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true })
  await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

async function readBlobData() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is missing.')
  }

  let blobUrl = cachedBlobUrl

  if (!blobUrl) {
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      prefix: BLOB_PREFIX,
      limit: 1000,
    })

    if (!blobs.length) {
      const defaults = cloneDefaults()
      await writeBlobData(defaults)
      return defaults
    }

    const latestBlob = [...blobs].sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    })[0]

    blobUrl = latestBlob.url
    cachedBlobUrl = blobUrl
  }

  const response = await fetch(blobUrl, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to read CMS blob data.')
  }

  const raw = await response.json()
  return normalizeCmsData(raw)
}

async function writeBlobData(data) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is missing.')
  }

  const key = `${BLOB_PREFIX}${Date.now()}-${crypto.randomUUID()}.json`
  const blob = await put(key, JSON.stringify(data), {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    access: 'public',
    contentType: 'application/json',
  })

  cachedBlobUrl = blob.url
}

async function loadData() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return readBlobData()
  }

  if (process.env.VERCEL) {
    throw new Error('Set BLOB_READ_WRITE_TOKEN for persistent CMS storage on Vercel.')
  }

  return readLocalData()
}

async function persistData(data) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return writeBlobData(data)
  }

  if (process.env.VERCEL) {
    throw new Error('Set BLOB_READ_WRITE_TOKEN for persistent CMS storage on Vercel.')
  }

  return writeLocalData(data)
}

function sortNews(items) {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
}

function sortGallery(items) {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1
    }

    const dateA = new Date(a.updatedAt).getTime()
    const dateB = new Date(b.updatedAt).getTime()
    return dateB - dateA
  })
}

export async function getPublishedNews() {
  const data = await loadData()
  return sortNews(data.news.filter((item) => item.published))
}

export async function getAdminNews() {
  const data = await loadData()
  return sortNews(data.news)
}

export async function createNews(payload) {
  const data = await loadData()
  const createdAt = nowIso()

  const item = normalizeNewsItem({
    ...payload,
    id: crypto.randomUUID(),
    createdAt,
    updatedAt: createdAt,
  })

  data.news.push(item)
  await persistData(data)
  return item
}

export async function updateNews(id, updates) {
  const data = await loadData()
  const index = data.news.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const updatedItem = normalizeNewsItem({
    ...data.news[index],
    ...updates,
    id,
    updatedAt: nowIso(),
  })

  data.news[index] = updatedItem
  await persistData(data)
  return updatedItem
}

export async function deleteNews(id) {
  const data = await loadData()
  const beforeLength = data.news.length
  data.news = data.news.filter((item) => item.id !== id)

  if (data.news.length === beforeLength) {
    return false
  }

  await persistData(data)
  return true
}

export async function getGalleryItems({ limit, onlyVisible = false } = {}) {
  const data = await loadData()
  const filtered = onlyVisible ? data.gallery.filter((item) => item.visible) : data.gallery
  const sorted = sortGallery(filtered)

  if (typeof limit === 'number') {
    return sorted.slice(0, limit)
  }

  return sorted
}

export async function getAdminGalleryItems() {
  const data = await loadData()
  return sortGallery(data.gallery)
}

export async function createGalleryItem(payload) {
  const data = await loadData()
  const createdAt = nowIso()

  const item = normalizeGalleryItem({
    ...payload,
    id: crypto.randomUUID(),
    createdAt,
    updatedAt: createdAt,
  })

  data.gallery.push(item)
  await persistData(data)
  return item
}

export async function updateGalleryItem(id, updates) {
  const data = await loadData()
  const index = data.gallery.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const updatedItem = normalizeGalleryItem({
    ...data.gallery[index],
    ...updates,
    id,
    updatedAt: nowIso(),
  })

  data.gallery[index] = updatedItem
  await persistData(data)
  return updatedItem
}

export async function deleteGalleryItem(id) {
  const data = await loadData()
  const beforeLength = data.gallery.length
  data.gallery = data.gallery.filter((item) => item.id !== id)

  if (beforeLength === data.gallery.length) {
    return false
  }

  await persistData(data)
  return true
}
