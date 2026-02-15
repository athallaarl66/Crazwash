// app/admin/orders/[id]/OrderDetailView.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container-custom py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-h2 text-primary">Order #{order.id}</h1>

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

      {order.customer && (
        <Card className="card-custom">
          <CardHeader>
            <CardTitle className="text-h4">Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body">{order.customer.name}</p>
            <p className="text-body-sm text-muted-foreground">
              {order.customer.email}
            </p>
          </CardContent>
        </Card>
      )}

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

      <div className="flex justify-end text-h4 font-bold text-primary">
        Total: {formatCurrency(order.totalPrice)}
      </div>
    </div>
  );
}
