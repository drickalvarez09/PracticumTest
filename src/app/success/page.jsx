'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { solidButton } from '@/components/buttonStyles'

function formatPrice(cents) {
  return '$' + (cents / 100).toLocaleString('en-US')
}

function SuccessContent() {
  const orderId = useSearchParams().get('order_id')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setError('No order id in the link.')
      return
    }

    let cancelled = false
    let timer
    const startedAt = Date.now()

    async function check() {
      try {
        const response = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' })
        if (response.status === 401) {
          window.location.assign('/login')
          return
        }
        const data = await response.json()
        if (cancelled) return

        if (!response.ok) {
          setError(data.error || 'Could not load this order.')
          setFinished(true)
          return
        }

        setOrder(data)
        // Paid and failed are final; pending keeps checking for up to 10 seconds.
        if (data.status === 'paid' || data.status === 'failed' || Date.now() - startedAt >= 10000) {
          setFinished(true)
          return
        }
        timer = setTimeout(check, 1000)
      } catch {
        if (cancelled) return
        if (Date.now() - startedAt >= 10000) {
          setError('Could not load this order.')
          setFinished(true)
          return
        }
        timer = setTimeout(check, 1000)
      }
    }

    check()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [orderId])

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl shadow-black/10">
        <h1 className="font-serif text-3xl">Something went wrong</h1>
        <p className="mt-2 text-gray">{error}</p>
        <Link href="/" className={`mt-6 ${solidButton}`}>
          Back to tours
        </Link>
      </div>
    )
  }

  if (!order) {
    return <p className="text-center text-lg font-semibold">Checking your payment…</p>
  }

  const heading =
    order.status === 'paid'
      ? 'Payment received'
      : order.status === 'failed'
        ? 'Payment failed'
        : 'Payment pending'

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl shadow-black/10">
      <h1 className="text-center font-serif text-3xl">{heading}</h1>
      <p className="mt-2 text-center text-gray">
        {order.status === 'paid'
          ? 'Thank you — your trip is booked.'
          : order.status === 'failed'
            ? 'The payment did not go through. You can try again from the tour card.'
            : finished
              ? 'Stripe has not confirmed yet. Refresh this page in a moment.'
              : 'Stripe is confirming your payment…'}
      </p>

      <dl className="mt-6 space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-gray">Order</dt>
          <dd className="font-semibold break-all">{order.id}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray">Status</dt>
          <dd className="font-semibold">{order.status}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray">Total</dt>
          <dd className="font-semibold">{formatPrice(order.amountTotal)}</dd>
        </div>
      </dl>

      {order.items?.length > 0 && (
        <ul className="mt-4 space-y-1 border-t border-light-gray pt-4">
          {order.items.map((line, index) => (
            <li key={index} className="flex justify-between gap-4">
              <span>
                {line.quantity} × {line.name}
              </span>
              <span className="font-semibold">{formatPrice(line.unitPrice * line.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className={solidButton}>
          Back to tours
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-8">
      <Suspense fallback={<p className="text-center text-lg font-semibold">Checking your payment…</p>}>
        <SuccessContent />
      </Suspense>
    </main>
  )
}
