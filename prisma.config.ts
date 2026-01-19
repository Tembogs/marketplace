import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Use SINGULAR 'datasource', NOT 'datasources'
  datasource: {
    url: env("DATABASE_URL"),
  },
  // Ensure the path to your schema is explicit
  schema: 'prisma/schema.prisma',
});