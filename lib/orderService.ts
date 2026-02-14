// lib/orderService.ts
import { prisma } from "./prisma";
import { generateOrderNumber } from "./utils";
import {
  Order,
  Product,
  User,
  OrderStatus,
  OrderService,
  PaymentStatus,
} from "@prisma/client";

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
  services: {
    serviceId: number;
    shoesQty: number;
  }[];
}

export type SerializedService = Omit<Product, "price"> & {
  price: number;
};

export type SerializedOrderService = Omit<
  OrderService,
  "unitPrice" | "subtotal"
> & {
  unitPrice: number;
  subtotal: number;
  product: SerializedService;
};

export type OrderWithServices = Omit<Order, "totalPrice"> & {
  totalPrice: number;
  customer?: User | null;
  services: SerializedOrderService[];
};

/* =======================
   CREATE ORDER
======================= */

export async function createOrder(
  input: CreateOrderInput,
): Promise<OrderWithServices> {
  const productIds = input.services.map((s) => s.serviceId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
      deletedAt: null,
    },
  });

  let totalPrice = 0;

  const orderServicesData = input.services.map((item) => {
    const product = products.find((p) => p.id === item.serviceId);
    if (!product) {
      throw new Error(`Service ${item.serviceId} not found`);
    }

    const unitPrice = Number(product.price);
    const subtotal = unitPrice * item.shoesQty;
    totalPrice += subtotal;

    return {
      productId: product.id,
      shoesQty: item.shoesQty,
      unitPrice,
      subtotal,
    };
  });

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
      totalPrice,
      status: "PENDING",
      paymentStatus: "UNPAID",
      services: {
        create: orderServicesData,
      },
    },
    include: {
      customer: true,
      services: {
        include: {
          product: true,
        },
      },
    },
  });

  return serializeOrder(order);
}

/* =======================
   SERIALIZER
======================= */

function serializeOrder(order: any): OrderWithServices {
  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    services: order.services.map((s: any) => ({
      ...s,
      unitPrice: Number(s.unitPrice),
      subtotal: Number(s.subtotal),
      product: {
        ...s.product,
        price: Number(s.product.price),
      },
    })),
  };
}

/* =======================
   GET ORDER BY ID
======================= */

export async function getOrderById(
  id: number,
): Promise<OrderWithServices | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      services: {
        include: { product: true },
      },
    },
  });

  if (!order) return null;
  return serializeOrder(order);
}

/* =======================
   GET ORDER BY NUMBER
======================= */

export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderWithServices | null> {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      customer: true,
      services: {
        include: { product: true },
      },
    },
  });

  if (!order) return null;
  return serializeOrder(order);
}

/* =======================
   ADMIN QUERIES
======================= */

type GetAllOrdersParams = {
  search?: string;
  paymentStatus?: PaymentStatus;
  status?: OrderStatus;
  page?: number;
  limit?: number;
};

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

export async function getAllOrders({
  search,
  paymentStatus,
  status,
  page = 1,
  limit = 10,
}: GetAllOrdersParams = {}) {
  const where: any = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { customerPhone: { contains: search, mode: "insensitive" } },
    ];
  }

  // ✅ FIX: Validasi paymentStatus sesuai schema
  if (paymentStatus) {
    const validStatuses = ["UNPAID", "PAID", "REFUNDED"] as PaymentStatus[];
    if (validStatuses.includes(paymentStatus)) {
      where.paymentStatus = paymentStatus;
    }
  }

  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        services: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders.map(serializeOrder),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
