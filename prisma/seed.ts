// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@shoeswash.com",
      password: "$2a$10$PLACEHOLDER", // Nanti kita implement bcrypt
      name: "Admin User",
      role: "ADMIN",
      phone: "081234567890",
    },
  });
  console.log("✅ Admin user created");

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Basic Wash",
        description:
          "Cuci standar untuk sepatu harian. Cocok untuk sepatu olahraga dan casual.",
        price: 25000,
        category: "BASIC",
        duration: 2880, // 2 hari dalam menit
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Premium Clean",
        description:
          "Cuci mendalam dengan poles dan waterproof. Untuk sepatu yang butuh extra care.",
        price: 45000,
        category: "PREMIUM",
        duration: 2880,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Deep Cleaning",
        description:
          "Deep cleaning untuk sepatu sangat kotor. Menggunakan ultrasonic technology.",
        price: 65000,
        category: "DEEP",
        duration: 4320, // 3 hari
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Treatment Khusus",
        description:
          "Treatment untuk material premium seperti suede, leather, dan canvas.",
        price: 85000,
        category: "TREATMENT",
        duration: 4320,
        isActive: true,
      },
    }),
  ]);
  console.log("✅ Products created:", products.length);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
