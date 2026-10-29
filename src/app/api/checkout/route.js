// cache-bust v3
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

// Never cache: every call creates a new order.
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const session = await auth()
  // No id means the user signed in before this field existed: ask them to sign in again.
  if (!session?.user?.id) {
    return Response.json({ error: 'Not signed in' }, { status: 401 })
  }

  try {
    const { itemId, quantity } = await request.json()
    const id = Number(itemId)
    const qty = Number(quantity ?? 1)
    if (!Number.isInteger(id) || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      return Response.json({ error: 'Invalid item or quantity' }, { status: 400 })
    }

    // The price comes from the database, never from the browser.
    const item = await prisma.item.findUnique({ where: { id } })
    if (!item) {
      return Response.json({ error: 'Item not found' }, { status: 404 })
    }

    // Prices are stored as whole dollars; Stripe wants the smallest unit (cents).
    const unitAmount = item.price * 100
    const amountTotal = unitAmount * qty

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: { userId: session.user.id, status: 'pending', amountTotal },
      })
      await tx.orderItem.create({
        data: { orderId: created.id, itemId: item.id, quantity: qty, unitPrice: unitAmount },
      })
      return created
    })

    const origin = new URL(request.url).origin
    const checkout = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: {
              name: item.name,
              description: `${item.days}-day ${item.type} tour`,
            },
          },
        },
      ],
      // The webhook uses this to find the order when Stripe says it is paid.
      metadata: { orderId: order.id },
      success_url: `${origin}/success?order_id=${order.id}`,
      cancel_url: `${origin}/`,
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkout.id },
    })

    return Response.json({ url: checkout.url })
  } catch (error) {
    console.error('POST /api/checkout failed', error)
    return Response.json({ error: 'Could not start checkout' }, { status: 500 })
  }
}
