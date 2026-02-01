import 'dotenv/config';
import prisma from "../../config/prisma.js"; // Standard import
import enumPkg from "../../generated/prisma/enums.js"; // Import the whole file
const { Role } = enumPkg as any;

import bcrypt from 'bcryptjs';


async function main() {
  console.log("🚀 Starting expert seeding...");
 


  // 🔍 Connection test
  try {
    const ping = await prisma.$queryRaw`SELECT 1`;
    console.log("Ping result:", ping);
  } catch (e) {
    console.error("❌ SELECT 1 failed:", e);
    throw e; // stop here if even SELECT 1 fails
  }

  const email = "expert2@marketplace.com";
  const defaultName = email.split('@')[0];

  const passwordHash = await bcrypt.hash('ExpertPassword123', 10);
  const expert = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: Role.EXPERT,
      name: defaultName,
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