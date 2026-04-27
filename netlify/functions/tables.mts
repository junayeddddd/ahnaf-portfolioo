import type { Config, Context } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

const STORE_NAME = 'portfolio-tables'

function getTableStore() {
  return getStore({ name: STORE_NAME, consistency: 'strong' })
}

function newId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  )
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function readTable(table: string) {
  const store = getTableStore()
  const data = await store.get(table, { type: 'json' })
  return Array.isArray(data) ? (data as Record<string, any>[]) : []
}

async function writeTable(table: string, rows: Record<string, any>[]) {
  const store = getTableStore()
  await store.setJSON(table, rows)
}

export default async (req: Request, context: Context) => {
  const { table, id } = context.params as { table: string; id?: string }

  if (!table) return jsonResponse({ error: 'Missing table name' }, 400)

  const url = new URL(req.url)
  const method = req.method.toUpperCase()

  try {
    if (method === 'GET') {
      const rows = await readTable(table)

      if (id) {
        const row = rows.find((r) => r.id === id)
        if (!row) return jsonResponse({ error: 'Not found' }, 404)
        return jsonResponse(row)
      }

      const limit = Number(url.searchParams.get('limit')) || rows.length
      const sort = url.searchParams.get('sort')
      let result = [...rows]

      if (sort) {
        result.sort((a, b) => {
          const av = a[sort]
          const bv = b[sort]
          if (av === bv) return 0
          return av > bv ? 1 : -1
        })
      }

      result = result.slice(0, limit)
      return jsonResponse({ data: result, total: rows.length })
    }

    if (method === 'POST') {
      const body = await req.json().catch(() => null)
      if (!body || typeof body !== 'object') {
        return jsonResponse({ error: 'Invalid JSON body' }, 400)
      }
      const rows = await readTable(table)
      const now = new Date().toISOString()
      const record = {
        ...body,
        id: (body as any).id || newId(),
        created_at: (body as any).created_at || now,
        updated_at: now,
      }
      rows.push(record)
      await writeTable(table, rows)
      return jsonResponse(record, 201)
    }

    if (method === 'PUT' || method === 'PATCH') {
      if (!id) return jsonResponse({ error: 'Missing id' }, 400)
      const body = await req.json().catch(() => null)
      if (!body || typeof body !== 'object') {
        return jsonResponse({ error: 'Invalid JSON body' }, 400)
      }
      const rows = await readTable(table)
      const idx = rows.findIndex((r) => r.id === id)
      if (idx === -1) return jsonResponse({ error: 'Not found' }, 404)
      rows[idx] = {
        ...rows[idx],
        ...body,
        id: rows[idx].id,
        created_at: rows[idx].created_at,
        updated_at: new Date().toISOString(),
      }
      await writeTable(table, rows)
      return jsonResponse(rows[idx])
    }

    if (method === 'DELETE') {
      if (!id) return jsonResponse({ error: 'Missing id' }, 400)
      const rows = await readTable(table)
      const next = rows.filter((r) => r.id !== id)
      if (next.length === rows.length) {
        return jsonResponse({ error: 'Not found' }, 404)
      }
      await writeTable(table, next)
      return new Response(null, { status: 204 })
    }

    return jsonResponse({ error: `Method ${method} not allowed` }, 405)
  } catch (err) {
    console.error('tables function error:', err)
    return jsonResponse({ error: 'Internal server error' }, 500)
  }
}

export const config: Config = {
  path: ['/tables/:table', '/tables/:table/:id'],
}
