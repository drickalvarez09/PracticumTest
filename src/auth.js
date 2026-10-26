import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'

export const { handlers } = NextAuth({
  // Credentials sign-in needs a JWT cookie; there is no database session table.
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  // We run behind localhost/Vercel only, so the forwarded host is trusted.
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').trim().toLowerCase()
        const password = String(credentials?.password ?? '')
        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !verifyPassword(password, user.passwordHash)) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
})
