// actions/orderActions.ts
"use server";

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { adminGuardResult } from "@/lib/api-error-handler";
import { notifyAdminsOfNewOrder } from "@/lib/orderService";
import {
  ORDER_RATE_LIMIT,
  clientIdentifier,
  rateLimit,
} from "@/lib/rate-limit";

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

    // 4. Abuse limit for public order creation
    const clientIp = clientIdentifier((await headers()).get("x-forwarded-for"));
    const limit = await rateLimit(
      `orders:${clientIp}`,
      ORDER_RATE_LIMIT.limit,
      ORDER_RATE_LIMIT.windowMs,
    );

    if (!limit.success) {
      return {
        success: false,
        error:
          "Terlalu banyak pesanan dari perangkat ini. Silakan coba lagi nanti atau hubungi admin Crazwash.",
      };
    }

    // 5. Extract city from address
    const city = extractCityFromAddress(address);
    console.log("📍 City extracted:", city);

    // ============================================
    // 🔥 CRITICAL: LINK OR CREATE USER
    // ============================================
    let userId: number | null = null;

    try {
      // Match on phone first, then on email: the first contact detail the customer
      // actually provided wins, so a phone match never adopts an unrelated account.
      const existingUser =
        (await prisma.user.findFirst({
          where: { phone: customerPhone, deletedAt: null },
        })) ??
        (customerEmail
          ? await prisma.user.findFirst({
              where: { email: customerEmail.toLowerCase(), deletedAt: null },
            })
          : null);

      if (existingUser) {
        // Link only. Name, address and especially role belong to the account owner;
        // checkout never rewrites them.
        userId = existingUser.id;
        console.log("🔗 Linked order to existing user ID:", userId);
      } else {
        // A checkout-created record must not be sign-in capable: the stored
        // credential is a hash of a random secret that is never disclosed, so the
        // account can only be used after an administrator sets a password.
        const undisclosedSecret = randomBytes(32).toString("hex");

        const createdUser = await prisma.user.create({
          data: {
            name: customerName,
            // No substitute email address is invented; email stays empty when the
            // customer did not provide one.
            email: customerEmail ? customerEmail.toLowerCase() : null,
            password: await bcrypt.hash(undisclosedSecret, 10),
            phone: customerPhone,
            address,
            city,
          },
        });

        userId = createdUser.id;
        console.log("✅ Created customer record with ID:", userId);
      }
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

    // Tell the operators. The writer lives in the order service and swallows its own
    // failures, so an unwritable notification never fails the order.
    await notifyAdminsOfNewOrder({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalPrice: parseFloat(order.totalPrice.toString()),
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
  // Exported from a "use server" module, so anyone can call it; mutating an order
  // requires an administrator session.
  const unauthorized = await adminGuardResult();
  if (unauthorized) return unauthorized;

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
