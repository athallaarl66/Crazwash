// prisma/seed.ts
import { PrismaClient, Role, ProductCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmins() {
  console.log("🌱 Seeding admins...");

  const admins = [
    {
      email: process.env.ADMIN1_EMAIL,
      name: process.env.ADMIN1_NAME,
      password: process.env.ADMIN1_PASSWORD,
    },
    {
      email: process.env.ADMIN2_EMAIL,
      name: process.env.ADMIN2_NAME,
      password: process.env.ADMIN2_PASSWORD,
    },
  ];

  for (const admin of admins) {
    if (!admin?.email || !admin?.password || !admin?.name) continue;

    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        email: admin.email,
        name: admin.name,
        password: await bcrypt.hash(admin.password, 10),
        role: Role.ADMIN,
      },
    });

    console.log(`✅ Admin ready: ${admin.email}`);
  }

  console.log("🚀 Admin seed finished.");
}

async function seedProducts() {
  console.log("🌱 Seeding products from katalog...");

  const products = [
    // ===== CLEANING TREATMENT =====
    {
      name: "Deep Clean",
      slug: "deep-clean",
      description: "Pembersihan mendalam untuk sepatu kotor berat",
      price: 50000,
      category: ProductCategory.DEEP,
      duration: 3,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Cuci Express",
      slug: "cuci-express",
      description: "Layanan cuci cepat 24 jam",
      price: 70000,
      category: ProductCategory.PREMIUM,
      duration: 1,
      isActive: true,
      sortOrder: 2,
      badge: "FAST",
    },
    {
      name: "Leather Care",
      slug: "leather-care",
      description: "Perawatan khusus sepatu kulit",
      price: 60000,
      category: ProductCategory.PREMIUM,
      duration: 3,
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "Suede Care",
      slug: "suede-care",
      description: "Perawatan khusus sepatu suede/beludru",
      price: 65000,
      category: ProductCategory.PREMIUM,
      duration: 3,
      isActive: true,
      sortOrder: 4,
    },
    {
      name: "Kids Shoes",
      slug: "kids-shoes",
      description: "Cuci sepatu anak-anak",
      price: 35000,
      category: ProductCategory.BASIC,
      duration: 2,
      isActive: true,
      sortOrder: 5,
    },
    {
      name: "Flatshoes",
      slug: "flatshoes",
      description: "Cuci sepatu flat/casual wanita",
      price: 30000,
      category: ProductCategory.BASIC,
      duration: 2,
      isActive: true,
      sortOrder: 6,
    },
    {
      name: "Sandal",
      slug: "sandal",
      description: "Cuci sandal jepit/gunung",
      price: 30000,
      category: ProductCategory.BASIC,
      duration: 2,
      isActive: true,
      sortOrder: 7,
    },
    {
      name: "Hat",
      slug: "hat",
      description: "Cuci topi/cap berbahan kain",
      price: 25000,
      category: ProductCategory.BASIC,
      duration: 2,
      isActive: true,
      sortOrder: 8,
    },
    {
      name: "Wallet",
      slug: "wallet",
      description: "Cuci dompet kulit/kanvas",
      price: 20000,
      category: ProductCategory.BASIC,
      duration: 2,
      isActive: true,
      sortOrder: 9,
    },

    // ===== BAG (by size) =====
    {
      name: "Bag S",
      slug: "bag-s",
      description: "Cuci tas ukuran kecil (sling bag, clutch)",
      price: 30000,
      category: ProductCategory.PREMIUM,
      duration: 3,
      isActive: true,
      sortOrder: 10,
    },
    {
      name: "Bag M",
      slug: "bag-m",
      description: "Cuci tas ukuran sedang (backpack kecil, tote)",
      price: 40000,
      category: ProductCategory.PREMIUM,
      duration: 3,
      isActive: true,
      sortOrder: 11,
    },
    {
      name: "Bag L",
      slug: "bag-l",
      description: "Cuci tas ukuran besar (backpack besar, duffel)",
      price: 60000,
      category: ProductCategory.DEEP,
      duration: 4,
      isActive: true,
      sortOrder: 12,
    },
    {
      name: "Bag XL",
      slug: "bag-xl",
      description: "Cuci tas ukuran extra besar (koper cabin, travel bag)",
      price: 100000,
      category: ProductCategory.DEEP,
      duration: 4,
      isActive: true,
      sortOrder: 13,
    },
    {
      name: "Bag XXL",
      slug: "bag-xxl",
      description: "Cuci tas ukuran jumbo (koper besar, carrier)",
      price: 170000,
      category: ProductCategory.DEEP,
      duration: 5,
      isActive: true,
      sortOrder: 14,
    },

    // ===== SPECIAL TREATMENT =====
    {
      name: "Reglue",
      slug: "reglue",
      description: "Perbaikan lem sepatu yang terkelupas/lepas",
      price: 100000,
      category: ProductCategory.TREATMENT,
      duration: 5,
      isActive: true,
      sortOrder: 15,
      badge: "REPAIR",
    },
    {
      name: "Repaint Midsole",
      slug: "repaint-midsole",
      description: "Repaint bagian midsole sepatu yang mengelupas",
      price: 80000,
      category: ProductCategory.TREATMENT,
      duration: 5,
      isActive: true,
      sortOrder: 16,
    },
    {
      name: "Repaint Upper",
      slug: "repaint-upper",
      description: "Repaint bagian upper sepatu (lebih kompleks)",
      price: 130000,
      category: ProductCategory.TREATMENT,
      duration: 7,
      isActive: true,
      sortOrder: 17,
    },
    {
      name: "Unyellow",
      slug: "unyellow",
      description: "Menghilangkan warna kuning pada sole/upper sepatu putih",
      price: 90000,
      category: ProductCategory.TREATMENT,
      duration: 5,
      isActive: true,
      sortOrder: 18,
      badge: "POPULAR",
    },

    // ===== HELMET =====
    {
      name: "Helmet",
      slug: "helmet",
      description: "Cuci helm bagian dalam dan luar, termasuk busa",
      price: 85000,
      category: ProductCategory.PREMIUM,
      duration: 3,
      isActive: true,
      sortOrder: 19,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`✅ Seeded ${products.length} products from katalog`);
}

async function main() {
  await seedAdmins();
  await seedProducts();
  console.log("🎉 All seeds completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
