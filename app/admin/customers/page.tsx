import { prisma } from "@/lib/prisma";
import CustomersClient from "./CustomersClient";
import { Customer } from "./types";

export default async function CustomersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  const customerMap = new Map<string, Customer>();
  const now = Date.now();

  for (const order of orders) {
    const phone = order.customerPhone;

    if (!customerMap.has(phone)) {
      customerMap.set(phone, {
        id: phone,
        name: order.customerName,
        phone,
        email: order.customerEmail || "-",
        address: order.address,
        city: order.city,

        totalOrders: 0,
        totalSpending: 0,

        firstOrderDate: order.createdAt,
        lastOrderDate: order.createdAt,

        status: "ACTIVE",
      });
    }

    const customer = customerMap.get(phone)!;

    customer.totalOrders += 1;

    // 🔥 Decimal → number (FIX UTAMA)
    customer.totalSpending += Number(order.totalPrice);

    if (order.createdAt > customer.lastOrderDate) {
      customer.lastOrderDate = order.createdAt;
    }
  }

  // 🔥 Hitung status customer
  customerMap.forEach((customer) => {
    const diffDays =
      (now - customer.lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays > 90) customer.status = "DORMANT";
    else if (diffDays > 30) customer.status = "IDLE";
    else customer.status = "ACTIVE";
  });

  return <CustomersClient customers={[...customerMap.values()]} />;
}
