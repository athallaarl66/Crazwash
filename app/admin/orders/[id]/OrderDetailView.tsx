// app/admin/orders/[id]/OrderDetailView.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OrderWithItems } from "@/lib/orderService";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { updateOrderStatusAction, updatePaymentStatusAction } from "../action";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function OrderDetailView({ order }: { order: OrderWithItems }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStatusUpdate(status: string) {
    if (
      !confirm(
        `Ubah status pesanan menjadi ${
          ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]
        }?`
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await updateOrderStatusAction(order.id, status as any);
    if (result.success) {
      router.refresh();
    } else {
      alert(`Error: ${result.error}`);
    }
    setLoading(false);
  }

  async function handlePaymentUpdate(status: "PAID" | "UNPAID") {
    if (
      !confirm(
        `Ubah status pembayaran menjadi ${PAYMENT_STATUS_LABELS[status]}?`
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await updatePaymentStatusAction(order.id, status);
    if (result.success) {
      router.refresh();
    } else {
      alert(`Error: ${result.error}`);
    }
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Dibuat pada {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={ORDER_STATUS_COLORS[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
          <Badge
            variant={order.paymentStatus === "PAID" ? "default" : "destructive"}
          >
            {PAYMENT_STATUS_LABELS[order.paymentStatus]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="font-semibold text-lg">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">No HP/WhatsApp</p>
              <p className="font-medium">{order.customerPhone}</p>
            </div>
            {order.customerEmail && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Alamat Pickup</p>
              <p className="font-medium">
                {order.address}
                <br />
                {order.city}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Pembayaran</p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(order.totalPrice)}
              </p>
            </div>
            {order.pickupDate && (
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pickup</p>
                <p className="font-medium">
                  {new Date(order.pickupDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
            {order.deliveryDate && (
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Selesai</p>
                <p className="font-medium">
                  {new Date(order.deliveryDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Catatan</p>
                <p className="font-medium text-sm bg-muted p-3 rounded-md">
                  {order.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Item Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  {item.product.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.product.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(item.unitPrice)} × {item.quantity} pasang
                    </span>
                    <Badge variant="outline">{item.product.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t-2">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Kelola Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Status */}
          <div>
            <p className="text-sm font-semibold mb-3">Update Status Order</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={order.status === "PENDING" ? "default" : "outline"}
                onClick={() => handleStatusUpdate("PENDING")}
                disabled={loading || order.status === "PENDING"}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={order.status === "CONFIRMED" ? "default" : "outline"}
                onClick={() => handleStatusUpdate("CONFIRMED")}
                disabled={loading || order.status === "CONFIRMED"}
              >
                Konfirmasi
              </Button>
              <Button
                size="sm"
                variant={order.status === "PICKED_UP" ? "default" : "outline"}
                onClick={() => handleStatusUpdate("PICKED_UP")}
                disabled={loading || order.status === "PICKED_UP"}
              >
                Sudah Diambil
              </Button>
              <Button
                size="sm"
                variant={order.status === "IN_PROGRESS" ? "default" : "outline"}
                onClick={() => handleStatusUpdate("IN_PROGRESS")}
                disabled={loading || order.status === "IN_PROGRESS"}
              >
                Sedang Dikerjakan
              </Button>
              <Button
                size="sm"
                variant={order.status === "READY" ? "default" : "outline"}
                onClick={() => handleStatusUpdate("READY")}
                disabled={loading || order.status === "READY"}
              >
                Siap Diambil
              </Button>
              <Button
                size="sm"
                variant={order.status === "COMPLETED" ? "default" : "outline"}
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={loading || order.status === "COMPLETED"}
              >
                Selesai
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusUpdate("CANCELLED")}
                disabled={loading || order.status === "CANCELLED"}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Batalkan"
                )}
              </Button>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <p className="text-sm font-semibold mb-3">
              Update Status Pembayaran
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={order.paymentStatus === "PAID" ? "default" : "outline"}
                onClick={() => handlePaymentUpdate("PAID")}
                disabled={loading || order.paymentStatus === "PAID"}
              >
                Sudah Dibayar
              </Button>
              <Button
                size="sm"
                variant={
                  order.paymentStatus === "UNPAID" ? "default" : "outline"
                }
                onClick={() => handlePaymentUpdate("UNPAID")}
                disabled={loading || order.paymentStatus === "UNPAID"}
              >
                Belum Dibayar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
