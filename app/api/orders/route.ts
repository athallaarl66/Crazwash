// app/api/orders/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // =====================
    // BASIC DATA
    // =====================
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerEmail = formData.get("customerEmail") as string | null;
    const address = formData.get("address") as string;
    const pickupDate = formData.get("pickupDate") as string;
    const notes = formData.get("notes") as string | null;
    const paymentMethod = formData.get("paymentMethod") as string;

    if (!customerName || !customerPhone || !address || !pickupDate) {
      return NextResponse.json(
        { error: "Data customer tidak lengkap" },
        { status: 400 },
      );
    }

    // =====================
    // SERVICES
    // =====================
    const productIds = formData.getAll("productId[]").map(Number);
    const quantities = formData.getAll("shoesQty[]").map((q) => Number(q));

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada layanan yang dipilih" },
        { status: 400 },
      );
    }

    // Map productId -> qty
    const qtyMap: Record<number, number> = {};
    productIds.forEach((id, idx) => {
      qtyMap[id] = quantities[idx];
    });

    // =====================
    // FETCH PRODUCTS (SOURCE OF TRUTH)
    // =====================
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        deletedAt: null,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Salah satu layanan tidak valid" },
        { status: 400 },
      );
    }

    // =====================
    // CALCULATE TOTAL
    // =====================
    let totalPrice = new Decimal(0);

    const orderServicesData = products.map((product) => {
      const qty = qtyMap[product.id];

      if (!qty || qty <= 0) {
        throw new Error("Jumlah sepatu tidak valid");
      }

      const subtotal = product.price.mul(qty);
      totalPrice = totalPrice.add(subtotal);

      return {
        productId: product.id,
        shoesQty: qty,
        unitPrice: product.price, // snapshot
        subtotal,
      };
    });

    // =====================
    // CREATE ORDER
    // =====================
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        customerName,
        customerPhone,
        customerEmail,
        address,
        pickupDate: new Date(pickupDate),
        notes,
        paymentMethod,
        paymentStatus: PaymentStatus.UNPAID,
        status: OrderStatus.PENDING,
        totalPrice,
        services: {
          create: orderServicesData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice.toNumber(),
      paymentMethod: order.paymentMethod,
      customerName: order.customerName,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pesanan" },
      { status: 500 },
    );
  }
}
