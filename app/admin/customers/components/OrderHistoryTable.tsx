// app/admin/customers/[phone]/components/OrderHistoryTable.tsx
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { OrderStatus, PaymentStatus } from "@prisma/client";

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

const orderStatusColor: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PICKED_UP: "bg-purple-100 text-purple-700",
  IN_PROGRESS: "bg-orange-100 text-orange-700",
  READY: "bg-green-100 text-green-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const paymentStatusColor: Record<PaymentStatus, string> = {
  UNPAID: "bg-red-100 text-red-700",
  PAID: "bg-green-100 text-green-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

// Terjemahan status
const translateOrderStatus = (status: OrderStatus) => {
  const translations: Record<OrderStatus, string> = {
    PENDING: "Menunggu",
    CONFIRMED: "Dikonfirmasi",
    PICKED_UP: "Diambil",
    IN_PROGRESS: "Diproses",
    READY: "Siap",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  };
  return translations[status] || status;
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
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="text-left p-3">Nomor Order</th>
            <th className="text-left p-3">Tanggal</th>
            <th className="text-right p-3">Total</th>
            <th className="text-center p-3">Status</th>
            <th className="text-center p-3">Pembayaran</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-muted/30">
              <td className="p-3 font-medium">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {order.orderNumber}
                </Link>
              </td>

              <td className="p-3 text-muted-foreground">
                {format(new Date(order.createdAt), "dd MMM yyyy", {
                  locale: idLocale,
                })}
              </td>

              <td className="p-3 text-right font-semibold">
                {formatCurrency(order.totalPrice)}
              </td>

              <td className="p-3 text-center">
                <Badge
                  variant="secondary"
                  className={orderStatusColor[order.status]}
                >
                  {translateOrderStatus(order.status)}
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
                  <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
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
