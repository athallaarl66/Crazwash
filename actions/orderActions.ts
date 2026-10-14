// actions/orderActions.ts
"use server";

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { adminGuardResult } from "@/lib/api-error-handler";
import {
  createOrder,
  InvalidServiceSelectionError,
  updateOrderStatus as updateOrderStatusInDb,
  type OrderWithServices,
} from "@/lib/orderService";
import {
  ORDER_RATE_LIMIT,
  clientIdentifier,
  rateLimit,
} from "@/lib/rate-limit";

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
    // 1. Extract customer data
    const customerName = formData.get("customerName") as string;
    // The form prefixes +62, so the stored number is the local part only; a pasted
    // leading zero or country code is trimmed here too, at the trust boundary.
    const customerPhone = normalizePhone(formData.get("customerPhone") as string);
    const customerEmail = (formData.get("customerEmail") as string) || null;
    const address = formData.get("address") as string;
    const pickupDateStr = formData.get("pickupDate") as string;
    const notes = (formData.get("notes") as string) || null;
    const paymentMethod = (formData.get("paymentMethod") as string) || null;

    // 2. Parse services
    const productIds = formData.getAll("productId[]") as string[];
    const shoesQties = formData.getAll("shoesQty[]") as string[];

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

    // 5. Resolve the customer account: link an existing one, or create a record
    // checkout owns. Never rewrites an existing account.
    let userId: number | null = null;

    try {
      // Match on phone first, then on email: the first contact detail the customer
      // actually provided wins, so a phone match never adopts an unrelated account.
      // Accounts written before the number was normalised may hold "08...", "+62..."
      // or "62...", so all four spellings of the same number are matched.
      const phoneSpellings = [
        customerPhone,
        `0${customerPhone}`,
        `62${customerPhone}`,
        `+62${customerPhone}`,
      ];

      const existingUser =
        (await prisma.user.findFirst({
          where: { phone: { in: phoneSpellings }, deletedAt: null },
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
      }
    } catch (userError) {
      console.error("❌ User creation/update error:", userError);
      // Continue without userId - order will still be created
      // but won't be linked to a user in the database
    }

    // 6. Create the order: one path, owned by the order service
    const pickupDate = pickupDateStr ? new Date(pickupDateStr) : null;

    let order: OrderWithServices;
    try {
      order = await createOrder({
        customerName,
        customerPhone,
        customerEmail,
        address,
        city,
        pickupDate,
        notes,
        paymentMethod,
        customerId: userId,
        services: productIds.map((idStr, index) => ({
          serviceId: parseInt(idStr),
          shoesQty: parseInt(shoesQties[index]),
        })),
      });
    } catch (error) {
      if (error instanceof InvalidServiceSelectionError) {
        console.error("❌ Invalid products found");
        return { success: false, error: "Ada layanan yang tidak valid" };
      }
      throw error;
    }

    // Revalidate both orders and customers pages
    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers");

    return {
      success: true,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      totalPrice: order.totalPrice,
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
    // One writer for the status trail: lib/orderService owns the history entry and
    // the completion timestamp, so this action does not duplicate that logic.
    await updateOrderStatusInDb(orderId, newStatus, adminNotes);

    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers");

    return { success: true };
  } catch (error) {
    console.error("❌ Update Status Error:", error);
    return { success: false, error: "Gagal update status" };
  }
}
