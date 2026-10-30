import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// The status changes while the success page polls, so never cache.
export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Not signed in' }, { status: 401 })
  }

  // Next.js 16 passes route params as a promise.
  const { id } = await params

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { item: true } } },
    })
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }
    if (order.userId !== session.user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json({
      id: order.id,
      status: order.status,
      amountTotal: order.amountTotal,
      createdAt: order.createdAt,
      items: order.items.map((line) => ({
        name: line.item.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
    })
  } catch (error) {
    console.error('GET /api/orders/[id] failed', error)
    return Response.json({ error: 'Failed to load order' }, { status: 500 })
  }
}
