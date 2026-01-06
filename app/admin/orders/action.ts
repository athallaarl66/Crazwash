// app/admin/orders/actions.ts
"use server";

import { updateOrderStatus } from "@/lib/orderService";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus } from "@prisma/client";

/**
 * Update order status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
 */
export async function updateOrderStatusAction(
  orderId: number,
  status: OrderStatus
) {
  try {
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update order status:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Update payment status (PAID / UNPAID)
 */
export async function updatePaymentStatusAction(
  orderId: number,
  status: PaymentStatus
) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update payment status:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Cancel order
 */
export async function cancelOrderAction(orderId: number) {
  return updateOrderStatusAction(orderId, "CANCELLED");
}

/**
 * Confirm order
 */
export async function confirmOrderAction(orderId: number) {
  return updateOrderStatusAction(orderId, "CONFIRMED");
}

/**
 * Complete order
 */
export async function completeOrderAction(orderId: number) {
  return updateOrderStatusAction(orderId, "COMPLETED");
}
