// app/admin/orders/components/OrderStatusBadge.tsx
"use client";

import { useTransition } from "react";
import { OrderStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatusAction } from "../action";
import clsx from "clsx";

/* ===============================
   ADMIN VISIBLE CONFIG
================================ */

// Status yg boleh muncul di admin
const ADMIN_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

// Label ramah admin
const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PICKED_UP: "Sudah Diambil",
  IN_PROGRESS: "Diproses",
  READY: "Siap / Diantar",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

// Warna konsisten & clean
const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  READY: "bg-purple-50 text-purple-700 border-purple-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",

  // internal (ga pernah keliatan)
  PICKED_UP: "",
  IN_PROGRESS: "",
};

// Flow sederhana & masuk akal
const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["READY", "CANCELLED"],
  READY: ["COMPLETED", "CANCELLED"],

  COMPLETED: ["READY"],
  CANCELLED: ["PENDING"],

  // internal (ga dipakai di admin)
  PICKED_UP: ["READY"],
  IN_PROGRESS: ["READY"],
};

/* ===============================
   HELPER
================================ */

function normalizeStatus(status: OrderStatus): OrderStatus {
  if (status === "PICKED_UP" || status === "IN_PROGRESS") {
    return "READY";
  }
  return status;
}

/* ===============================
   COMPONENT
================================ */

type Props = {
  orderId: number;
  status: OrderStatus;
};

export default function OrderStatusBadge({ orderId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  const current = normalizeStatus(status);
  const nextStatuses = STATUS_FLOW[current];

  function onChange(next: OrderStatus) {
    if (next === current) return;

    const confirmText =
      current === "COMPLETED" || current === "CANCELLED"
        ? `Status sudah final. Yakin ubah ke "${STATUS_LABEL[next]}"?`
        : `Ubah status ke "${STATUS_LABEL[next]}"?`;

    if (!confirm(confirmText)) return;

    startTransition(() => {
      updateOrderStatusAction(orderId, next);
    });
  }

  return (
    <Select value={current} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger
        className={clsx("h-8 w-[160px] text-xs border", STATUS_COLOR[current])}
      >
        <SelectValue>{STATUS_LABEL[current]}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={current} disabled>
          {STATUS_LABEL[current]}
        </SelectItem>

        {nextStatuses
          .filter((s) => ADMIN_STATUSES.includes(s))
          .map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABEL[s]}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
