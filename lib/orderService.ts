// lib/orderService.ts
import { prisma } from "./prisma";
import { generateOrderNumber } from "./utils";
import { Order, OrderItem, Product, User, OrderStatus } from "@prisma/client";

/* =======================
   TYPES
======================= */
export interface CreateOrderInput {
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
}

export type SerializedProduct = Omit<Product, "price"> & {
  price: number;
};

export type SerializedOrderItem = Omit<OrderItem, "unitPrice" | "subtotal"> & {
  unitPrice: number;
  subtotal: number;
  product: SerializedProduct;
};

export type OrderWithItems = Omit<Order, "totalPrice"> & {
  totalPrice: number;
  customer?: User | null;
  items: SerializedOrderItem[];
};

/* =======================
   CREATE ORDER
======================= */
export async function createOrder(
  input: CreateOrderInput
): Promise<OrderWithItems> {
  // 1. Get products untuk calculate price
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  // 2. Calculate total & prepare order items
  let totalPrice = 0;
  const orderItemsData = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const unitPrice = Number(product.price);
    const subtotal = unitPrice * item.quantity;
    totalPrice += subtotal;

    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: unitPrice,
      subtotal: subtotal,
    };
  });

  // 3. Create order with items
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      address: input.address,
      city: input.city || "Bandung",
      pickupDate: input.pickupDate,
      notes: input.notes,
      totalPrice: totalPrice,
      status: "PENDING",
      paymentStatus: "UNPAID",
      items: {
        create: orderItemsData,
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

  // 4. Serialize Decimal fields
  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  };
}

/* =======================
   GET ORDER BY NUMBER
======================= */
export async function getOrderByNumber(
  orderNumber: string,
  phone: string
): Promise<OrderWithItems | null> {
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: orderNumber,
      customerPhone: phone,
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) return null;

  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  };
}

/* =======================
   GET ALL ORDERS (for admin)
======================= */
export async function getAllOrders(): Promise<OrderWithItems[]> {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    ...order,
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  }));
}

/* =======================
   GET ORDER BY ID (for admin)
======================= */
export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) return null;

  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  };
}

/* =======================
   UPDATE ORDER STATUS
======================= */
export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus // ← Gunakan enum dari Prisma
): Promise<OrderWithItems> {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  };
}
