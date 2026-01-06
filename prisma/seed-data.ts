import {
  PrismaClient,
  Category,
  OrderStatus,
  PaymentStatus,
  Role,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ======================
  // 1. ADMIN
  // ======================
  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@shoes.com" },
    update: {},
    create: {
      email: "admin@shoes.com",
      name: "Admin",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "081234567890",
    },
  });

  console.log("✅ Admin created");

  // ======================
  // 2. CUSTOMERS
  // ======================
  const customers = [];
  const customerSeeds = [
    "Andi Pratama",
    "Rizky Maulana",
    "Dimas Saputra",
    "Putri Ayu",
    "Nabila Zahra",
    "Fajar Nugroho",
    "Agus Setiawan",
    "Bintang Ramadhan",
  ];

  for (let i = 0; i < customerSeeds.length; i++) {
    const email = `customer${i + 1}@mail.com`;
    const customer = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: customerSeeds[i],
        password: await bcrypt.hash("customer123", 10),
        role: Role.CUSTOMER,
        phone: `0812345678${i}`,
        address: "Bandung, Jawa Barat",
      },
    });
    customers.push(customer);
  }

  console.log("✅ Customers created:", customers.length);

  // ======================
  // 3. PRODUCTS (SERVICES)
  // ======================
  const products = [
    {
      name: "Treatment Khusus",
      description:
        "Suede treatment Leather care Canvas restoration Color restoration",
      price: 85000,
      category: Category.TREATMENT,
      duration: 0,
    },
    {
      name: "Deep Cleaning",
      description: "Deep Cleaning sepatu kotor",
      price: 65000,
      category: Category.DEEP,
      duration: 0,
    },
    {
      name: "Basic Wash",
      description: "Cuci luar dalam standar",
      price: 25000,
      category: Category.BASIC,
      duration: 0,
    },
    {
      name: "Premium Clean",
      description: "Deep cleaning Polish & shine Deodorizer Waterproof spray",
      price: 45000,
      category: Category.PREMIUM,
      duration: 0,
    },
  ];

  const createdProducts = [];
  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        category: p.category,
        duration: p.duration,
        isActive: true,
        stock: 100,
      },
    });
    createdProducts.push(product);
  }

  console.log("✅ Products created:", createdProducts.length);

  // ======================
  // 4. ORDERS
  // ======================
  const today = new Date();

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 120);
    const createdAt = new Date();
    createdAt.setDate(today.getDate() - daysAgo);

    const customer = customers[Math.floor(Math.random() * customers.length)];
    const selected = createdProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);

    const totalPrice = selected.reduce((sum, p) => sum + p.price.toNumber(), 0);

    const status: OrderStatus =
      daysAgo < 7 ? "PENDING" : daysAgo < 30 ? "IN_PROGRESS" : "COMPLETED";

    const paymentStatus: PaymentStatus =
      status === "COMPLETED" ? "PAID" : "UNPAID";

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone ?? "",
        customerEmail: customer.email,
        totalPrice,
        status,
        paymentStatus,
        pickupDate: status !== "PENDING" ? new Date(createdAt) : null,
        deliveryDate: status === "COMPLETED" ? new Date() : null,
        address: customer.address ?? "Bandung",
        city: "Bandung",
        createdAt,
      },
    });

    for (const product of selected) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price,
        },
      });
    }
  }

  console.log("🎉 Seed finished successfully!");
  console.log("Admin login:");
  console.log("📧 admin@shoes.com");
  console.log("🔑 admin123");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
