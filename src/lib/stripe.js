import Stripe from 'stripe'

let client

// One Stripe client per server process. Created on first use, so `next build`
// does not need the secret key just to load this file.
export function getStripe() {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY)
  return client
}
