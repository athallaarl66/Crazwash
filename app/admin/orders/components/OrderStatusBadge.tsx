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
import { Loader2 } from "lucide-react";

const ADMIN_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  PICKED_UP: "Sudah Diambil",
  IN_PROGRESS: "Diproses",
  READY: "Siap / Diantar",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: "bg-warning/10 text-warning border-warning/20",
  CONFIRMED: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  READY: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  COMPLETED: "bg-success/10 text-success border-success/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  PICKED_UP: "",
  IN_PROGRESS: "",
};

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["READY", "CANCELLED"],
  READY: ["COMPLETED", "CANCELLED"],
  COMPLETED: ["READY"],
  CANCELLED: ["PENDING"],
  PICKED_UP: ["READY"],
  IN_PROGRESS: ["READY"],
};

function normalizeStatus(status: OrderStatus): OrderStatus {
  if (status === "PICKED_UP" || status === "IN_PROGRESS") {
    return "READY";
  }
  return status;
}

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
        className={clsx(
          "h-8 w-[160px] sm:w-[180px] text-caption border",
          STATUS_COLOR[current],
        )}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating...
          </div>
        ) : (
          <SelectValue>{STATUS_LABEL[current]}</SelectValue>
        )}
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
