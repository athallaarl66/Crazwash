// app/admin/orders/[id]/OrderDetailView.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type { OrderWithServices } from "@/lib/orderService";
import OrderStatusBadge from "../components/OrderStatusBadge";
import PaymentStatusBadge from "../components/PaymentStatusBadge";

type StatusHistoryEntry = {
  status?: string;
  timestamp?: string;
  note?: string;
};

function historyEntries(history: unknown): StatusHistoryEntry[] {
  if (!Array.isArray(history)) return [];

  return history.filter(
    (entry): entry is StatusHistoryEntry =>
      typeof entry === "object" && entry !== null,
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-body text-foreground mt-1">{value}</p>
    </div>
  );
}

export default function OrderDetailView({
  order,
}: {
  order: OrderWithServices;
}) {
  const history = historyEntries(order.statusHistory);
  const hasNotes = Boolean(order.notes || order.adminNotes);
  const pickupAddress = [order.address, order.city].filter(Boolean).join(", ");

  return (
    <div className="container-custom py-8 space-y-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-h2 text-primary">Order #{order.id}</h1>

        {/* Status and payment are changed from here, so the operator does not have
            to hunt the order down in the list to move it forward. */}
        <div className="flex gap-2">
          <OrderStatusBadge orderId={order.id} status={order.status} />
          <PaymentStatusBadge
            orderId={order.id}
            status={order.paymentStatus}
          />
        </div>
      </div>

      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="text-h4">Customer</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field
            label="Nama"
            value={order.customer?.name ?? order.customerName}
          />
          <Field label="Telepon" value={order.customerPhone} />
          <Field
            label="Email"
            value={order.customer?.email ?? order.customerEmail ?? "Tidak ada"}
          />
          <Field label="Order Number" value={order.orderNumber} />
        </CardContent>
      </Card>

      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="text-h4">Pickup &amp; Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Alamat Pickup" value={pickupAddress} />
          <Field
            label="Tanggal Pickup"
            value={
              order.pickupDate ? formatDate(order.pickupDate) : "Belum dijadwalkan"
            }
          />
          <Field
            label="Metode Pembayaran"
            value={order.paymentMethod ?? "Belum dipilih"}
          />
          <Field
            label="Bukti Pembayaran"
            value={order.paymentProof ?? "Belum diunggah"}
          />
          <Field
            label="Dibuat"
            value={formatDateTime(order.createdAt)}
          />
          <Field
            label="Selesai"
            value={
              order.completedDate
                ? formatDateTime(order.completedDate)
                : "Belum selesai"
            }
          />
        </CardContent>
      </Card>

      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="text-h4">Catatan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasNotes ? (
            <>
              {order.notes && (
                <Field label="Catatan Pelanggan" value={order.notes} />
              )}
              {order.adminNotes && (
                <Field label="Catatan Internal" value={order.adminNotes} />
              )}
            </>
          ) : (
            <p className="text-body-sm text-muted-foreground">
              Tidak ada catatan pelanggan maupun catatan internal untuk pesanan
              ini.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="text-h4">Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-body">
                  {service.product.name}
                </h3>

                {service.product.description && (
                  <p className="text-body-sm text-muted-foreground mt-1">
                    {service.product.description}
                  </p>
                )}

                <div className="mt-2 text-body-sm text-muted-foreground">
                  {formatCurrency(service.unitPrice)} × {service.shoesQty}{" "}
                  pasang
                </div>
              </div>

              <div className="text-right font-semibold text-primary mt-2 sm:mt-0">
                {formatCurrency(service.subtotal)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="card-custom">
        <CardHeader>
          <CardTitle className="text-h4">Riwayat Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {history.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">
              Belum ada riwayat status tercatat.
            </p>
          ) : (
            history.map((entry, index) => (
              <div key={index} className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-border">
                    {entry.status ?? "Tidak diketahui"}
                  </Badge>
                  <span className="text-body-sm text-muted-foreground">
                    {entry.timestamp
                      ? formatDateTime(entry.timestamp)
                      : "Waktu tidak tercatat"}
                  </span>
                </div>
                {entry.note && (
                  <p className="text-body-sm text-muted-foreground">
                    {entry.note}
                  </p>
                )}
                {index < history.length - 1 && <Separator className="mt-4" />}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end text-h4 font-bold text-primary">
        Total: {formatCurrency(order.totalPrice)}
      </div>
    </div>
  );
}
