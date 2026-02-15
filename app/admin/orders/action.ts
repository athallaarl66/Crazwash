// app/admin/orders/action.ts
"use server";

import { updateOrderStatus } from "@/lib/orderService";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function updateOrderStatusAction(
  orderId: number,
  status: OrderStatus,
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

export async function updatePaymentStatusAction(
  orderId: number,
  status: PaymentStatus,
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

export async function cancelOrderAction(orderId: number) {
  return updateOrderStatusAction(orderId, "CANCELLED");
}

export async function confirmOrderAction(orderId: number) {
  return updateOrderStatusAction(orderId, "CONFIRMED");
}

export async function completeOrderAction(orderId: number) {
  return updateOrderStatusAction(orderId, "COMPLETED");
}

export async function markAsPaidAction(orderId: number) {
  return updatePaymentStatusAction(orderId, "PAID");
}

export async function markAsUnpaidAction(orderId: number) {
  return updatePaymentStatusAction(orderId, "UNPAID");
}
