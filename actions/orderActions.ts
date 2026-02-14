// actions/orderActions.ts - FULL UPDATED VERSION
"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

// Helper function to extract city from address
function extractCityFromAddress(address: string): string {
  const cities = [
    "Bandung",
    "Jakarta",
    "Surabaya",
    "Yogyakarta",
    "Semarang",
    "Bali",
    "Medan",
    "Makassar",
    "Palembang",
    "Balikpapan",
  ];
  const addressLower = address.toLowerCase();

  for (const city of cities) {
    if (addressLower.includes(city.toLowerCase())) {
      return city;
    }
  }
  return "Bandung"; // Default city
}

export async function createOrderAction(formData: FormData): Promise<{
  success: boolean;
  orderNumber?: string;
  customerName?: string;
  totalPrice?: number;
  paymentMethod?: string;
  error?: string;
}> {
  try {
    console.log("🔵 Starting createOrderAction...");

    // 1. Extract customer data
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerEmail = (formData.get("customerEmail") as string) || null;
    const address = formData.get("address") as string;
    const pickupDateStr = formData.get("pickupDate") as string;
    const notes = (formData.get("notes") as string) || null;
    const paymentMethod = (formData.get("paymentMethod") as string) || null;

    console.log("📋 Form data extracted:", {
      customerName,
      customerPhone,
      customerEmail,
      address,
      pickupDateStr,
      notes,
      paymentMethod,
    });

    // 2. Parse services
    const productIds = formData.getAll("productId[]") as string[];
    const shoesQties = formData.getAll("shoesQty[]") as string[];

    console.log("🛒 Services:", productIds, shoesQties);

    // 3. Validation
    if (!customerName || !customerPhone || !address) {
      console.error("❌ Missing required fields");
      return {
        success: false,
        error: "Nama, nomor HP, dan alamat wajib diisi",
      };
    }

    if (productIds.length === 0 || shoesQties.length === 0) {
      console.error("❌ No services selected");
      return { success: false, error: "Pilih minimal 1 layanan" };
    }

    if (!paymentMethod) {
      console.error("❌ No payment method selected");
      return { success: false, error: "Pilih metode pembayaran" };
    }

    // 4. Extract city from address
    const city = extractCityFromAddress(address);
    console.log("📍 City extracted:", city);

    // ============================================
    // 🔥 CRITICAL: CREATE OR UPDATE USER
    // ============================================
    let userId: number | null = null;

    try {
      // Cek apakah user sudah ada (by phone first)
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: customerPhone },
            ...(customerEmail ? [{ email: customerEmail }] : []),
          ],
        },
      });

      console.log(
        "👤 User lookup result:",
        user ? `Found user ID: ${user.id}` : "No user found",
      );

      if (!user) {
        // Create new user with CUSTOMER role
        user = await prisma.user.create({
          data: {
            name: customerName,
            email: customerEmail || `customer-${Date.now()}@temp.com`,
            password:
              "$2a$10$xjLHA.v6qWUw1eLPU.KW8.YY5QdMAlG6lPjMSA4g/EgPfw.GR1kBe", // Temporary hashed password
            phone: customerPhone,
            address: address,
            city: city, // ✅ SIMPAN CITY KE
            role: "CUSTOMER",
          },
        });
        console.log("✅ Created new user with ID:", user.id);
      } else {
        // Update existing user (ensure role is CUSTOMER and update info)
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: customerName,
            address: address,
            city: city, // ✅ UPDATE CITY DI USER
            role: "CUSTOMER", // Ensure role is CUSTOMER
            lastLogin: new Date(),
          },
        });
        console.log("✅ Updated existing user ID:", user.id);
      }

      userId = user.id;
    } catch (userError) {
      console.error("❌ User creation/update error:", userError);
      // Continue without userId - order will still be created
      // but won't be linked to a user in the database
    }

    // 5. Get product prices
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds.map((id) => parseInt(id)) },
        isActive: true,
        deletedAt: null,
      },
      select: { id: true, price: true, name: true },
    });

    if (products.length !== productIds.length) {
      console.error("❌ Invalid products found");
      return { success: false, error: "Ada layanan yang tidak valid" };
    }

    console.log("💰 Products found:", products);

    // 6. Calculate total
    const priceMap = new Map(
      products.map((p) => [p.id, parseFloat(p.price.toString())]),
    );

    let totalPrice = 0;
    const services = productIds.map((idStr, index) => {
      const productId = parseInt(idStr);
      const shoesQty = parseInt(shoesQties[index]);
      const unitPrice = priceMap.get(productId) || 0;
      const subtotal = unitPrice * shoesQty;

      totalPrice += subtotal;

      return {
        productId,
        shoesQty,
        unitPrice,
        subtotal,
      };
    });

    console.log("🧮 Total calculated:", totalPrice);

    // 7. Parse pickup date
    const pickupDate = pickupDateStr ? new Date(pickupDateStr) : null;

    // 8. Generate order number
    const orderNumber = generateOrderNumber();
    console.log("📦 Order number generated:", orderNumber);

    // 9. Create order WITH userId link
    const orderData: any = {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      address,
      city: city, // ✅ Use extracted city, not hardcoded
      pickupDate,
      notes,
      paymentMethod,
      totalPrice,
      status: "PENDING",
      paymentStatus: "UNPAID",
      statusHistory: [
        {
          status: "PENDING",
          timestamp: new Date().toISOString(),
          note: "Pesanan dibuat, menunggu konfirmasi pembayaran",
        },
      ],
      services: {
        create: services,
      },
    };

    // Add customerId if we have a userId
    if (userId) {
      orderData.customer = { connect: { id: userId } };
      console.log("🔗 Linking order to user ID:", userId);
    }

    const order = await prisma.order.create({
      data: orderData,
    });

    console.log("✅ Order created successfully:", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
    });

    // Revalidate both orders and customers pages
    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers"); // 🔥 CRITICAL: Revalidate customers page

    return {
      success: true,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalPrice: parseFloat(order.totalPrice.toString()),
      paymentMethod: order.paymentMethod || "",
    };
  } catch (error: any) {
    console.error("❌ Create Order Error:", error);
    return {
      success: false,
      error: error.message || "Gagal membuat pesanan. Silakan coba lagi.",
    };
  }
}

export async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus,
  adminNotes?: string,
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { statusHistory: true },
    });

    if (!order) {
      return { success: false, error: "Order tidak ditemukan" };
    }

    const statusHistory = [
      ...(order.statusHistory as any[]),
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: adminNotes || `Status diubah menjadi ${newStatus}`,
      },
    ];

    const updateData: any = {
      status: newStatus,
      adminNotes,
      statusHistory,
    };

    // If order is completed, set completedDate
    if (newStatus === "COMPLETED") {
      updateData.completedDate = new Date();
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers"); // 🔥 Also revalidate customers when order status changes

    return { success: true };
  } catch (error) {
    console.error("❌ Update Status Error:", error);
    return { success: false, error: "Gagal update status" };
  }
}
