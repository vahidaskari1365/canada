import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// On Vercel/serverless the filesystem is read-only, so SQLite writes will fail.
// We still allow reads (the seeded db file is bundled). Writes (bookings,
// assessments, contact messages) are wrapped defensively at the API layer.
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

/**
 * Whether the database is writable in this environment.
 * On Vercel serverless the filesystem is read-only, so we surface this to
 * the API routes so they can return a friendly error instead of crashing.
 */
export const DB_WRITABLE = process.env.DATABASE_URL?.startsWith('file:') === false
  ? true // remote DB (postgres/mysql) — always writable
  : process.env.VERCEL !== '1'; // local file SQLite — not writable on Vercel
