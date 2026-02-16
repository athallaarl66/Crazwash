// lib/customerService.ts - FULL UPDATED
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

// ============================================
// Types
// ============================================

export type CustomerStatus = "ACTIVE" | "IDLE" | "DORMANT";

export type CustomerSummary = {
  phone: string;
  name: string;
  email: string | null;
  address: string;
  city: string;
  totalOrders: number;
  totalSpending: number;
  lastOrderDate: string;
  status: CustomerStatus;
  userId: number;
};

export type CustomerDetail = {
  phone: string;
  name: string;
  email: string | null;
  address: string;
  city: string;
  totalOrders: number;
  totalSpending: number;
  averageOrderValue: number;
  firstOrderDate: string;
  lastOrderDate: string;
  status: CustomerStatus;
  userId: number;
};

export type CustomerOrder = {
  id: number;
  orderNumber: string;
  createdAt: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  pickupDate: string | null;
  completedDate: string | null;
};

// ============================================
// Helper Functions
// ============================================

function computeStatusFromLastOrder(
  lastOrderDate: Date | null,
): CustomerStatus {
  if (!lastOrderDate) return "DORMANT";

  const now = Date.now();
  const lastOrderTime = lastOrderDate.getTime();
  const diffDays = (now - lastOrderTime) / (1000 * 60 * 60 * 24);

  if (diffDays > 90) return "DORMANT";
  else if (diffDays > 30) return "IDLE";
  else return "ACTIVE";
}

function formatPhoneForNull(phone: string | null, userId: number): string {
  return phone || `NO-PHONE-${userId}`;
}

// ============================================
// Main Functions
// ============================================

export async function getCustomersSummary(): Promise<CustomerSummary[]> {
  // AMBIL DATA DARI USER
  const users = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true, // ✅ AMBIL CITY DARI USER
      orders: {
        where: {
          status: OrderStatus.COMPLETED,
          paymentStatus: PaymentStatus.PAID,
        },
        select: {
          totalPrice: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // GROUP BY PHONE (HANDLE NULL & DUPLICATE)
  const customerMap = new Map<string, CustomerSummary>();

  users.forEach((user) => {
    const formattedPhone = formatPhoneForNull(user.phone, user.id);

    if (!customerMap.has(formattedPhone)) {
      const lastOrder = user.orders[0];

      customerMap.set(formattedPhone, {
        phone: formattedPhone,
        name: user.name,
        email: user.email,
        address: user.address || "",
        city: user.city || "Bandung", // ✅ AMBIL DARI USER.CITY
        totalOrders: user.orders.length,
        totalSpending: user.orders.reduce(
          (sum, o) => sum + Number(o.totalPrice),
          0,
        ),
        lastOrderDate:
          lastOrder?.createdAt.toISOString() || new Date().toISOString(),
        status: computeStatusFromLastOrder(lastOrder?.createdAt || null),
        userId: user.id,
      });
    } else {
      // HANDLE DUPLICATE PHONE: COMBINE DATA
      const existing = customerMap.get(formattedPhone)!;

      // Update stats
      existing.totalOrders += user.orders.length;
      existing.totalSpending += user.orders.reduce(
        (sum, o) => sum + Number(o.totalPrice),
        0,
      );

      // Update last order date
      const userLastOrder = user.orders[0];
      if (userLastOrder) {
        const existingDate = new Date(existing.lastOrderDate);
        if (userLastOrder.createdAt > existingDate) {
          existing.lastOrderDate = userLastOrder.createdAt.toISOString();
          existing.status = computeStatusFromLastOrder(userLastOrder.createdAt);
        }
      }
    }
  });

  return Array.from(customerMap.values()).sort(
    (a, b) =>
      new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime(),
  );
}

export async function getCustomerByPhone(
  phone: string,
): Promise<CustomerDetail | null> {
  // 🚨 DECODE PHONE SPECIAL FORMAT
  let userId: number | null = null;
  let actualPhone = phone;

  // Check if it's a NO-PHONE format
  if (phone.startsWith("NO-PHONE-")) {
    userId = parseInt(phone.replace("NO-PHONE-", ""));

    // Get user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { customer: true },
        },
      },
    });

    if (!user) return null;

    actualPhone = user.phone || phone;
  } else {
    // 🚨 HANDLE MULTIPLE USERS WITH SAME PHONE
    const users = await prisma.user.findMany({
      where: { phone: actualPhone },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { customer: true },
        },
      },
    });

    if (users.length === 0) return null;

    // 🚨 AMBIL USER DENGAN ORDER TERBARU
    const userWithLatestOrder = users.reduce((latest, current) => {
      const latestOrder = latest.orders[0];
      const currentOrder = current.orders[0];

      if (!latestOrder) return current;
      if (!currentOrder) return latest;

      return currentOrder.createdAt > latestOrder.createdAt ? current : latest;
    });

    userId = userWithLatestOrder.id;
  }

  // Get all orders untuk user ini
  const allOrders = await prisma.order.findMany({
    where: {
      OR: [{ customerPhone: actualPhone }, { customerId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  if (allOrders.length === 0) return null;

  // Filter hanya COMPLETED & PAID untuk stats
  const completedPaidOrders = allOrders.filter(
    (o) =>
      o.status === OrderStatus.COMPLETED &&
      o.paymentStatus === PaymentStatus.PAID,
  );

  const latestOrder = allOrders[0];
  const firstOrder = allOrders[allOrders.length - 1];

  const totalOrders = completedPaidOrders.length;
  const totalSpending = completedPaidOrders.reduce(
    (sum, o) => sum + Number(o.totalPrice),
    0,
  );
  const averageOrderValue = totalOrders > 0 ? totalSpending / totalOrders : 0;

  const status = computeStatusFromLastOrder(latestOrder.createdAt);
  const customer = latestOrder.customer;

  return {
    phone: actualPhone,
    name: customer?.name || latestOrder.customerName,
    email: customer?.email || latestOrder.customerEmail || null,
    address: latestOrder.address,
    city: latestOrder.city,
    totalOrders,
    totalSpending,
    averageOrderValue,
    firstOrderDate: firstOrder.createdAt.toISOString(),
    lastOrderDate: latestOrder.createdAt.toISOString(),
    status,
    userId: userId!,
  };
}

export async function getOrdersByPhone(
  phone: string,
): Promise<CustomerOrder[]> {
  // Handle NO-PHONE format
  let whereClause: any = { customerPhone: phone };

  if (phone.startsWith("NO-PHONE-")) {
    const userId = parseInt(phone.replace("NO-PHONE-", ""));
    whereClause = { customerId: userId };
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      totalPrice: true,
      status: true,
      paymentStatus: true,
      pickupDate: true,
      completedDate: true,
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    totalPrice: Number(order.totalPrice),
    status: order.status,
    paymentStatus: order.paymentStatus,
    pickupDate: order.pickupDate?.toISOString() || null,
    completedDate: order.completedDate?.toISOString() || null,
  }));
}

export async function getCompletedPaidOrdersByPhone(
  phone: string,
): Promise<CustomerOrder[]> {
  // Handle NO-PHONE format
  let whereClause: any = {
    customerPhone: phone,
    status: OrderStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
  };

  if (phone.startsWith("NO-PHONE-")) {
    const userId = parseInt(phone.replace("NO-PHONE-", ""));
    whereClause = {
      customerId: userId,
      status: OrderStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    };
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      totalPrice: true,
      status: true,
      paymentStatus: true,
      pickupDate: true,
      completedDate: true,
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    totalPrice: Number(order.totalPrice),
    status: order.status,
    paymentStatus: order.paymentStatus,
    pickupDate: order.pickupDate?.toISOString() || null,
    completedDate: order.completedDate?.toISOString() || null,
  }));
}

// ✅ TAMBAH FUNGSI DELETE CUSTOMER (SOFT DELETE)
export async function deleteCustomer(userId: number) {
  try {
    // Soft delete: set deletedAt instead of hard delete
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw new Error("Failed to delete customer");
  }
}
