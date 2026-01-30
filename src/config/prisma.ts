import 'dotenv/config';
import Prisma from "../generated/prisma/client.js";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const { Pool } = pg;
const { PrismaClient } = Prisma;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['warn', 'error'],
});

export default prisma;