'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { solidButton } from '@/components/buttonStyles'

const inputClass =
  'w-full rounded-xl border-2 border-light-gray bg-white px-3 py-2.5 font-normal text-black focus:border-teal focus:outline-none'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setPending(true)
    setError('')

    const form = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          password: form.get('password'),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Could not create account')
        return
      }

      router.push('/login')
    } catch {
      setError('Could not create account. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-light-gray bg-white p-6 shadow-sm sm:p-8">
        <Link href="/" className="text-sm font-semibold text-teal hover:text-teal-dark">
          &larr; Back to Wanderly
        </Link>

        <h1 className="mt-4 font-serif text-3xl font-bold text-teal-dark">Create an account</h1>
        <p className="mt-1 text-sm text-gray">Save your plans and pick up where you left off.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Name <span className="font-normal text-gray">(optional)</span>
            <input className={inputClass} type="text" name="name" autoComplete="name" />
          </label>

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
              autoComplete="new-password"
              minLength={8}
              required
            />
            <small className="font-normal text-gray">At least 8 characters.</small>
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
            {pending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-teal hover:text-teal-dark">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
