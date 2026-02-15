// app/admin/orders/components/PaymentStatusBadge.tsx
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
import { updatePaymentStatusAction } from "../action";
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "@/lib/constants";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

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
          "h-8 w-[140px] sm:w-[160px] text-caption border",
          PAYMENT_STATUS_COLORS[current],
        )}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating...
          </div>
        ) : (
          <SelectValue>{PAYMENT_STATUS_LABELS[current]}</SelectValue>
        )}
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
