import { prisma } from '@/lib/prisma'

// Always read from the database, never serve a cached response.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await prisma.item.findMany({ orderBy: { id: 'asc' } })
    return Response.json(items)
  } catch (error) {
    console.error('GET /api/items failed', error)
    return Response.json({ error: 'Failed to load items' }, { status: 500 })
  }
}
