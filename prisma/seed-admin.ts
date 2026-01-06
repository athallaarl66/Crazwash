import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@shoes.com" },
    update: {},
    create: {
      email: "admin@shoes.com",
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN, // ← Pakai enum ADMIN
    },
  });

  console.log("✅ Admin user created");
  console.log("📧 Email:", admin.email);
  console.log("🔑 Password: admin123");
  console.log("👤 Role:", admin.role);
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
