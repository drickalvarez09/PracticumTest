import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export async function GET() {
  const models = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'))
  return Response.json({ models, hasOrder: models.includes('order') })
}