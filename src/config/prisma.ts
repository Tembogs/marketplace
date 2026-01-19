import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Using the standard Postgres pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// Initialize Prisma with the local adapter
const prisma = new PrismaClient({ adapter })

export default prisma