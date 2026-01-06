"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderStatusBadge from "./OrderStatusBadge";
import {
  updatePaymentStatusAction,
  updateOrderStatusAction,
} from "../orders/action"; // ← UBAH ke actions (plural)
import type { OrderWithItems } from "@/lib/orderService";
import { OrderStatus, PaymentStatus } from "@prisma/client"; // ← IMPORT dari Prisma

export default function OrdersTable({ orders }: { orders: OrderWithItems[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const handlePaymentUpdate = async (id: number, status: PaymentStatus) => {
    setLoadingId(id);
    const result = await updatePaymentStatusAction(id, status);
    if (!result.success) {
      alert(result.error);
    }
    setLoadingId(null);
  };

  const handleOrderStatusUpdate = async (id: number, status: OrderStatus) => {
    setUpdatingStatusId(id);
    const result = await updateOrderStatusAction(id, status);
    setUpdatingStatusId(null);

    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Update Status</TableHead>
            <TableHead className="text-right">Payment</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>

              <TableCell>
                <div>{order.customerName}</div>
                <div className="text-sm text-muted-foreground">
                  {order.customerPhone}
                </div>
              </TableCell>

              <TableCell className="font-semibold">
                Rp {order.totalPrice.toLocaleString("id-ID")}
              </TableCell>

              <TableCell>
                <OrderStatusBadge
                  paymentStatus={order.paymentStatus}
                  orderStatus={order.status}
                />
              </TableCell>

              {/* ORDER STATUS DROPDOWN */}
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    handleOrderStatusUpdate(order.id, value as OrderStatus)
                  }
                  disabled={updatingStatusId === order.id}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="READY">Ready</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              {/* PAYMENT STATUS BUTTON */}
              <TableCell className="text-right">
                {order.paymentStatus === "UNPAID" ? (
                  <Button
                    size="sm"
                    disabled={loadingId === order.id}
                    onClick={() => handlePaymentUpdate(order.id, "PAID")}
                  >
                    {loadingId === order.id ? "Updating..." : "Tandai PAID"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loadingId === order.id}
                    onClick={() => handlePaymentUpdate(order.id, "UNPAID")}
                  >
                    Jadikan UNPAID
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
