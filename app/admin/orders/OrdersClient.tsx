// app/admin/orders/OrdersClient.tsx
"use client";

import { useMemo, useState } from "react";
import OrdersTable from "../components/OrdersTable";
import OrderFilters from "../components/OrderFilters";
import type { OrderWithItems } from "@/lib/orderService";

export default function OrdersClient({ orders }: { orders: OrderWithItems[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | "PAID" | "UNPAID">("ALL");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "ALL" || o.paymentStatus === status;

      return matchSearch && matchStatus;
    });
  }, [orders, search, status]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Kelola pesanan dan status pembayaran
        </p>
      </div>

      <OrderFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
