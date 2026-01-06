// app/admin/components/OrderStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { ORDER_STATUS_COLORS } from "@/lib/constants";
import clsx from "clsx";

type Props = {
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
};

export default function OrderStatusBadge({
  paymentStatus,
  orderStatus,
}: Props) {
  // Define colors for all order statuses
  const orderStatusColors: Record<OrderStatus, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PICKED_UP: "bg-purple-50 text-purple-700 border-purple-200",
    IN_PROGRESS: "bg-orange-50 text-orange-700 border-orange-200",
    READY: "bg-green-50 text-green-700 border-green-200",
    COMPLETED: "bg-gray-50 text-gray-700 border-gray-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="flex flex-col gap-1">
      {/* PAYMENT STATUS */}
      <Badge
        className={clsx(
          "w-fit border",
          paymentStatus === "PAID"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
        )}
      >
        {paymentStatus}
      </Badge>

      {/* ORDER STATUS - All 7 Statuses */}
      <Badge
        className={clsx("w-fit text-xs border", orderStatusColors[orderStatus])}
      >
        {orderStatus}
      </Badge>
    </div>
  );
}
