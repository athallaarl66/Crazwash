// app/(admin)/orders/components/PaymentStatusBadge.tsx - FIXED FOR CURRENT SCHEMA
"use client";

import { useTransition } from "react";
import { PaymentStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePaymentStatusAction } from "@/app/admin/orders/action";
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "@/lib/constants";
import clsx from "clsx";

// ✅ SESUAIKAN DENGAN SCHEMA SEKARANG (hanya 3 values)
const PAYMENT_FLOW: Record<PaymentStatus, PaymentStatus[]> = {
  UNPAID: ["PAID", "REFUNDED"],
  PAID: ["REFUNDED"],
  REFUNDED: ["PAID"],
};

type Props = {
  orderId: number;
  status: PaymentStatus;
};

export default function PaymentStatusBadge({ orderId, status }: Props) {
  const [isPending, startTransition] = useTransition();

  const current = status;
  const nextStatuses = PAYMENT_FLOW[current] || [];

  function onChange(next: PaymentStatus) {
    if (next === current) return;

    if (
      confirm(`Ubah status pembayaran ke "${PAYMENT_STATUS_LABELS[next]}"?`)
    ) {
      startTransition(() => {
        updatePaymentStatusAction(orderId, next);
      });
    }
  }

  return (
    <Select value={current} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger
        className={clsx(
          "h-8 w-[140px] text-xs border",
          PAYMENT_STATUS_COLORS[current],
        )}
      >
        <SelectValue>{PAYMENT_STATUS_LABELS[current]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={current} disabled>
          {PAYMENT_STATUS_LABELS[current]}
        </SelectItem>
        {nextStatuses.map((s) => (
          <SelectItem key={s} value={s}>
            {PAYMENT_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
