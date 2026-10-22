// Copies the tour packages from src/data/siteData.js into the Item table.
// Safe to run more than once: each tour is upserted by its existing id.
import { PrismaClient } from '@prisma/client'
import { tours } from '../src/data/siteData.js'

const prisma = new PrismaClient()

try {
  for (const tour of tours) {
    const data = {
      name: tour.name,
      description: tour.description,
      type: tour.type,
      days: tour.days,
      price: tour.price,
      badge: tour.badge ?? null,
      featured: tour.featured ?? false,
      image: tour.image,
      alt: tour.alt,
    }

    await prisma.item.upsert({
      where: { id: tour.id },
      update: data,
      create: { id: tour.id, ...data },
    })
  }

  console.log(`Seeded ${tours.length} tours`)
} finally {
  await prisma.$disconnect()
}
