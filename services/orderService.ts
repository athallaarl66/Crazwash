// src/services/orderService.ts
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  city?: string;
  pickupDate?: Date;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}) {
  let totalPrice = 0;

  const itemsWithPrice = await Promise.all(
    data.items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) throw new Error("Product not found");

      const price = product.price.toNumber();
      const subtotal = price * item.quantity;
      totalPrice += subtotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      };
    })
  );

  return prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      address: data.address,
      city: data.city || "Bandung",
      pickupDate: data.pickupDate,
      notes: data.notes,
      totalPrice,
      status: "PENDING",
      paymentStatus: "UNPAID",
      items: {
        create: itemsWithPrice,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getOrderByNumber(orderNumber: string, phone: string) {
  return prisma.order.findFirst({
    where: {
      orderNumber,
      customerPhone: phone,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}
