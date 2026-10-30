import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  // Raw text, not JSON: Stripe signs the exact bytes it sent, so parsing
  // first would change them and the signature check would fail.
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Stripe webhook signature check failed:', error.message)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const orderId = event.data.object.metadata?.orderId
      const order = orderId
        ? await prisma.order.findUnique({ where: { id: orderId } })
        : null

      // Stripe retries and can send the same event twice, so only flip
      // an order that exists and is not already paid.
      if (order && order.status !== 'paid') {
        await prisma.order.update({ where: { id: order.id }, data: { status: 'paid' } })
      }
    }

    // Every other event type is acknowledged and ignored.
    return Response.json({ received: true })
  } catch (error) {
    // A 500 tells Stripe to retry, which is what we want if the database hiccuped.
    console.error('Stripe webhook handling failed:', error)
    return Response.json({ error: 'Webhook handling failed' }, { status: 500 })
  }
}
