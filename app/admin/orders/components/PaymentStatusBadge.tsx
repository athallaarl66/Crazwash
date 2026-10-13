// app/admin/orders/components/PaymentStatusBadge.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PaymentStatus } from "@prisma/client";
import { toast } from "sonner";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { updatePaymentStatusAction } from "../action";
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "@/lib/constants";

const PAYMENT_FLOW: Record<PaymentStatus, PaymentStatus[]> = {
  UNPAID: ["PAID", "REFUNDED"],
  PAID: ["REFUNDED"],
  REFUNDED: ["PAID"],
};

/** Transition that moves money back out, so it needs explicit confirmation. */
const PAYMENT_DESTRUCTIVE: PaymentStatus[] = ["REFUNDED"];

type Props = {
  orderId: number;
  status: PaymentStatus;
};

export default function PaymentStatusBadge({ orderId, status }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingChange, setPendingChange] = useState<PaymentStatus | null>(null);

  const current = status;
  const nextStatuses = PAYMENT_FLOW[current] || [];

  function apply(next: PaymentStatus) {
    startTransition(async () => {
      const result = await updatePaymentStatusAction(orderId, next);

      if (result?.success) {
        toast.success(
          `Status pembayaran diubah ke "${PAYMENT_STATUS_LABELS[next]}"`,
        );
        router.refresh();
      } else {
        toast.error(
          `Gagal mengubah status pembayaran: ${result?.error ?? "kesalahan tidak diketahui"}`,
        );
      }
    });
  }

  function onChange(next: PaymentStatus) {
    if (next === current) return;

    if (PAYMENT_DESTRUCTIVE.includes(next)) {
      setPendingChange(next);
      return;
    }

    apply(next);
  }

  return (
    <>
      <Select value={current} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger
          className={clsx(
            "h-8 w-[140px] sm:w-[160px] text-caption border",
            PAYMENT_STATUS_COLORS[current],
          )}
          suppressHydrationWarning
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

      <ConfirmDialog
        open={pendingChange !== null}
        onOpenChange={(open) => {
          if (!open) setPendingChange(null);
        }}
        title="Kembalikan pembayaran?"
        description={
          pendingChange === null
            ? ""
            : `Pembayaran pesanan ini akan ditandai "${PAYMENT_STATUS_LABELS[pendingChange]}". Yakin uang sudah dikembalikan ke pelanggan?`
        }
        confirmLabel="Kembalikan pembayaran"
        destructive
        onConfirm={() => {
          const next = pendingChange;
          setPendingChange(null);
          if (next) apply(next);
        }}
      />
    </>
  );
}
