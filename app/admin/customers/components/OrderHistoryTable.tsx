// app/admin/customers/[phone]/components/OrderHistoryTable.tsx
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/constants";

type CustomerOrder = {
  id: number;
  orderNumber: string;
  createdAt: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  pickupDate: string | null;
  completedDate: string | null;
};

const paymentStatusColor: Record<PaymentStatus, string> = {
  UNPAID: "bg-destructive/10 text-destructive border-destructive/20",
  PAID: "bg-success/10 text-success border-success/20",
  REFUNDED: "bg-muted text-muted-foreground border-muted",
};

const translatePaymentStatus = (status: PaymentStatus) => {
  const translations: Record<PaymentStatus, string> = {
    UNPAID: "Belum Bayar",
    PAID: "Sudah Bayar",
    REFUNDED: "Dikembalikan",
  };
  return translations[status] || status;
};

export default function OrderHistoryTable({
  orders,
}: {
  orders: CustomerOrder[];
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada pesanan
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 font-semibold text-foreground">
              Nomor Order
            </th>
            <th className="text-left p-3 font-semibold text-foreground">
              Tanggal
            </th>
            <th className="text-right p-3 font-semibold text-foreground">
              Total
            </th>
            <th className="text-center p-3 font-semibold text-foreground">
              Status
            </th>
            <th className="text-center p-3 font-semibold text-foreground">
              Pembayaran
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-muted/50">
              <td className="p-3 font-medium">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-primary hover:text-primary/80 hover:underline"
                >
                  {order.orderNumber}
                </Link>
              </td>

              <td className="p-3 text-muted-foreground">
                {format(new Date(order.createdAt), "dd MMM yyyy", {
                  locale: idLocale,
                })}
              </td>

              <td className="p-3 text-right font-semibold text-foreground">
                {formatCurrency(order.totalPrice)}
              </td>

              <td className="p-3 text-center">
                <Badge
                  variant="secondary"
                  className={ORDER_STATUS_COLORS[order.status]}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </td>

              <td className="p-3 text-center">
                <Badge
                  variant="secondary"
                  className={paymentStatusColor[order.paymentStatus]}
                >
                  {translatePaymentStatus(order.paymentStatus)}
                </Badge>
              </td>

              <td className="p-3 text-right">
                <Link href={`/admin/orders/${order.id}`}>
                  <button className="text-body-sm text-primary hover:text-primary/80 hover:underline">
                    Lihat
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
