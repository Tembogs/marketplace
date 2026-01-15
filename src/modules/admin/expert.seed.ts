import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import prisma from '../../config/prisma'; 
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  console.log("🚀 Starting expert seeding...");

  const passwordHash = await bcrypt.hash('ExpertPassword123', 10);
  
  const expert = await prisma.user.upsert({
    where: { email: 'expert@marketplace.com' },
    update: {},
    create: {
      email: 'expert@marketplace.com',
      passwordHash,
      role: Role.EXPERT,
      expertProfile: {
        create: {
          bio: "I am a verified expert.",
          isAvailable: true,
          rating: 5.0
        }
      }
    },
  });

  console.log(`✅ Expert ${expert.email} created successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });