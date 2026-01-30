import 'dotenv/config'
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx src/modules/admin/expert.seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});