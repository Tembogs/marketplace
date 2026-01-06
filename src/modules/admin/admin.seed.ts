import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
 async function main() {
  console.log("🚀 Starting admin seeding...");
  
  const passwordHash = await bcrypt.hash('AdminPassword123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marketplace.com' },
    update: {},
    create: {
      email: 'admin@marketplace.com',
      passwordHash,
      role: Role.ADMIN,
    },
  })

  console.log(`✅ Admin ${admin.email} created/verified successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
