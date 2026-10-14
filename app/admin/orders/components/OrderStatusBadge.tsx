// app/admin/orders/components/OrderStatusBadge.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";
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
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_DESTRUCTIVE,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TRANSITIONS,
} from "@/lib/constants";
import { updateOrderStatusAction } from "../action";

type Props = {
  orderId: number;
  status: OrderStatus;
};

export default function OrderStatusBadge({ orderId, status }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingChange, setPendingChange] = useState<OrderStatus | null>(null);

  // The stored status is displayed as-is: the console used to rewrite PICKED_UP and
  // IN_PROGRESS to READY, which hid two statuses the data model defines.
  const current = status;
  const nextStatuses = ORDER_STATUS_TRANSITIONS[current];
  const reopensFinalState = current === "COMPLETED" || current === "CANCELLED";

  function apply(next: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next);

      if (result?.success) {
        toast.success(`Status diubah ke "${ORDER_STATUS_LABELS[next]}"`);
        // The action revalidates the affected paths; refresh so the row shows what
        // storage actually holds.
        router.refresh();
      } else {
        toast.error(
          `Gagal mengubah status: ${result?.error ?? "kesalahan tidak diketahui"}`,
        );
      }
    });
  }

  function onChange(next: OrderStatus) {
    if (next === current) return;

    // A destructive transition and reopening a final state both need an explicit
    // confirmation from the operator, through the console's own dialog.
    if (ORDER_STATUS_DESTRUCTIVE.includes(next) || reopensFinalState) {
      setPendingChange(next);
      return;
    }

    apply(next);
  }

  const destructive =
    pendingChange !== null && ORDER_STATUS_DESTRUCTIVE.includes(pendingChange);
  const confirmTitle = destructive
    ? "Batalkan pesanan?"
    : "Ubah status final?";
  const confirmDescription =
    pendingChange === null
      ? ""
      : destructive
        ? `Pesanan akan ditandai "${ORDER_STATUS_LABELS[pendingChange]}". Pekerjaan yang sudah dijanjikan ke pelanggan tidak dilanjutkan.`
        : `Status pesanan sudah final ("${ORDER_STATUS_LABELS[current]}"). Yakin ubah ke "${ORDER_STATUS_LABELS[pendingChange]}"?`;

  return (
    <>
      <Select value={current} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger
          className={clsx(
            "h-8 w-[160px] sm:w-[180px] text-caption border",
            ORDER_STATUS_COLORS[current],
          )}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating...
            </div>
          ) : (
            <SelectValue>{ORDER_STATUS_LABELS[current]}</SelectValue>
          )}
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={current} disabled>
            {ORDER_STATUS_LABELS[current]}
          </SelectItem>

          {nextStatuses.map((s) => (
            <SelectItem key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ConfirmDialog
        open={pendingChange !== null}
        onOpenChange={(open) => {
          if (!open) setPendingChange(null);
        }}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={destructive ? "Batalkan pesanan" : "Ubah status"}
        destructive={destructive}
        onConfirm={() => {
          const next = pendingChange;
          setPendingChange(null);
          if (next) apply(next);
        }}
      />
    </>
  );
}
