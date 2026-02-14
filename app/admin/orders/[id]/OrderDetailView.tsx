// app/admin/orders/[id]/OrderDetailView.tsx
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { OrderWithServices } from "@/lib/orderService";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";

export default function OrderDetailView({
  order,
}: {
  order: OrderWithServices;
}) {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>

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

      {/* CUSTOMER */}
      {order.customer && (
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-1">Customer</h2>
          <p>{order.customer.name}</p>
          <p className="text-sm text-muted-foreground">
            {order.customer.email}
          </p>
        </div>
      )}

      {/* SERVICES */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Services</h2>

        {order.services.map((service) => (
          <div
            key={service.id}
            className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{service.product.name}</h3>

              {service.product.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {service.product.description}
                </p>
              )}

              <div className="mt-2 text-sm text-muted-foreground">
                {formatCurrency(service.unitPrice)} × {service.shoesQty} pasang
              </div>
            </div>

            <div className="text-right font-semibold">
              {formatCurrency(service.subtotal)}
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="flex justify-end text-xl font-bold">
        Total: {formatCurrency(order.totalPrice)}
      </div>
    </div>
  );
}
