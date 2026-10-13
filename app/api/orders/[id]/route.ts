// app/api/orders/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { adminGuardResponse } from "@/lib/api-error-handler";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authorize before touching the request, so an unauthenticated caller cannot
    // learn anything about the id it guessed (it previously got a 400).
    const denied = await adminGuardResponse();
    if (denied) return denied;

    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const { action } = await req.json();

    // =====================
    // MARK AS PAID
    // =====================
    if (action === "PAID") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          status: OrderStatus.CONFIRMED,
        },
      });
    }

    // =====================
    // CANCEL ORDER
    // =====================
    if (action === "CANCELLED") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
