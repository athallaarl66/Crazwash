"use client";

import { useMemo, useState } from "react";
import OrdersTable from "./OrdersTable";
import OrderFilters from "./OrderFilters";

export default function OrdersClient({ orders }: { orders: any[] }) {
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
    <div className="space-y-6">
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
