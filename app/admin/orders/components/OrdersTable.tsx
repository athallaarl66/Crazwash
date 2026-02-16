// app/admin/orders/components/OrdersTable.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderStatusBadge from "./OrderStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import type { OrderWithServices } from "@/lib/orderService";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Eye } from "lucide-react"; // ← REMOVE MoreVertical, ExternalLink, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger

export default function OrdersTable({
  orders,
}: {
  orders: OrderWithServices[];
}) {
  const router = useRouter();

  return (
    <div className="rounded-lg border overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-semibold text-foreground">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-foreground hidden md:table-cell">
                Tanggal
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Payment
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground hidden md:table-cell">
                Total
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <svg
                        className="h-6 w-6 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <p className="font-medium text-muted-foreground">
                      No orders found
                    </p>
                    <p className="text-body-sm text-muted-foreground mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-muted/50 border-b last:border-0"
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {order.orderNumber}
                      </span>
                      <span className="text-caption text-muted-foreground mt-0.5">
                        ID: {order.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {order.customer?.name ?? order.customerName}
                      </span>
                      <span className="text-caption text-muted-foreground truncate max-w-[150px]">
                        {order.customer?.email ??
                          order.customerEmail ??
                          "No email"}
                      </span>
                      <span className="text-caption text-muted-foreground">
                        {order.customerPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge
                      orderId={order.id}
                      status={order.paymentStatus}
                    />
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge
                      orderId={order.id}
                      status={order.status}
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(order.totalPrice)}
                    </div>
                    <div className="text-caption text-muted-foreground">
                      {order.services.length} service(s)
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
