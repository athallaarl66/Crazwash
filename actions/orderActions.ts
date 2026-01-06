// actions/orderActions.ts
"use server";

import { createOrder, getOrderByNumber } from "@/lib/orderService"; // ← UBAH INI
import { revalidatePath } from "next/cache";
import type { OrderWithItems } from "@/lib/orderService"; // ← UPDATE TYPE

/* =======================
   TYPES
======================= */
export interface CreateOrderResponse {
  success: boolean;
  orderNumber?: string;
  orderId?: number;
  error?: string;
}

export interface TrackOrderResponse {
  success: boolean;
  order?: OrderWithItems; // ← UPDATE TYPE
  error?: string;
}

/* =======================
   CREATE ORDER
======================= */
export async function createOrderAction(
  formData: FormData
): Promise<CreateOrderResponse> {
  try {
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const pickupDate = formData.get("pickupDate") as string;
    const notes = formData.get("notes") as string;
    const productIds = formData.getAll("productId") as string[];
    const quantities = formData.getAll("quantity") as string[];

    if (!customerName || !customerPhone || !address) {
      return {
        success: false,
        error: "Nama, nomor HP, dan alamat wajib diisi",
      };
    }

    if (productIds.length === 0) {
      return {
        success: false,
        error: "Pilih minimal 1 layanan",
      };
    }

    const items = productIds.map((id, index) => ({
      productId: parseInt(id),
      quantity: parseInt(quantities[index] || "1"),
    }));

    const order = await createOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      address,
      city: city || undefined,
      pickupDate: pickupDate ? new Date(pickupDate) : undefined,
      notes: notes || undefined,
      items,
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    };
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return {
      success: false,
      error: error.message || "Gagal membuat pesanan",
    };
  }
}

/* =======================
   TRACK ORDER
======================= */
export async function trackOrderAction(
  formData: FormData
): Promise<TrackOrderResponse> {
  try {
    const orderNumber = formData.get("orderNumber") as string;
    const phone = formData.get("phone") as string;

    if (!orderNumber || !phone) {
      return {
        success: false,
        error: "Order number dan nomor HP wajib diisi",
      };
    }

    const order = await getOrderByNumber(orderNumber, phone);

    if (!order) {
      return {
        success: false,
        error: "Pesanan tidak ditemukan",
      };
    }

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error("Track order failed:", error);
    return {
      success: false,
      error: "Gagal melacak pesanan",
    };
  }
}
