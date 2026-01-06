// app/api/orders/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const orderId = Number(id);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    const { action } = await request.json();

    // =====================
    // MARK AS PAID
    // =====================
    if (action === "PAID") {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!order) throw new Error("Order not found");
        if (order.paymentStatus === "PAID") return;

        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
          },
        });
      });
    }

    // =====================
    // CANCEL ORDER
    // =====================
    if (action === "CANCELLED") {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (!order) throw new Error("Order not found");

        if (order.paymentStatus === "PAID") {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            });
          }
        }

        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "CANCELLED",
          },
        });
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
