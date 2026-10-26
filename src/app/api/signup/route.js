import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const email = String(body?.email ?? '').trim().toLowerCase()
  const password = String(body?.password ?? '')
  const name = String(body?.name ?? '').trim()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email address' }, { status: 400 })
  }
  if (password.length < 8) {
    return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  try {
    await prisma.user.create({
      data: { email, name: name || null, passwordHash: hashPassword(password) },
    })
  } catch (error) {
    // P2002 = unique constraint on User.email
    if (error?.code === 'P2002') {
      return Response.json({ error: 'That email is already registered' }, { status: 409 })
    }
    console.error('POST /api/signup failed', error)
    return Response.json({ error: 'Could not create account' }, { status: 500 })
  }

  return Response.json({ ok: true }, { status: 201 })
}
