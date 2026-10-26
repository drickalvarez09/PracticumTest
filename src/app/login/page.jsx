'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { solidButton } from '@/components/buttonStyles'

const inputClass =
  'w-full rounded-xl border-2 border-light-gray bg-white px-3 py-2.5 font-normal text-black focus:border-teal focus:outline-none'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(event.currentTarget)

    try {
      const result = await signIn('credentials', {
        email: form.get('email'),
        password: form.get('password'),
        redirect: false,
      })

      if (result?.error) {
        setError('Email or password is incorrect')
        return
      }

      // Full navigation so the SessionProvider refetches the new cookie.
      window.location.assign('/')
    } catch {
      setError('Could not sign in. Please try again.')
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-light-gray bg-white p-6 shadow-sm sm:p-8">
        <Link href="/" className="text-sm font-semibold text-teal hover:text-teal-dark">
          &larr; Back to Wanderly
        </Link>

        <h1 className="mt-4 font-serif text-3xl font-bold text-teal-dark">Sign in</h1>
        <p className="mt-1 text-sm text-gray">Welcome back — your next trip is waiting.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Email
            <input
              className={inputClass}
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-semibold">
            Password
            <input
              className={inputClass}
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <p className="text-sm font-medium text-red" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className={`${solidButton} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray">
          No account yet?{' '}
          <Link href="/signup" className="font-semibold text-teal hover:text-teal-dark">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
