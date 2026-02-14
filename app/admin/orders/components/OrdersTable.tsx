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
import { MoreVertical, Eye, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrdersTable({
  orders,
}: {
  orders: OrderWithServices[];
}) {
  const router = useRouter();

  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-gray-700 hidden md:table-cell">
                Tanggal
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Payment
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700 hidden md:table-cell">
                Total
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <svg
                        className="h-6 w-6 text-gray-300"
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
                    <p className="font-medium text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 border-b last:border-0"
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        ID: {order.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {order.customer?.name ?? order.customerName}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                        {order.customer?.email ??
                          order.customerEmail ??
                          "No email"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {order.customerPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-600">
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
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.services.length} service(s)
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild suppressHydrationWarning>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              navigator.clipboard.writeText(order.orderNumber)
                            }
                            className="cursor-pointer"
                          >
                            Copy Order ID
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/admin/orders/${order.id}`)
                            }
                            className="cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <ExternalLink className="h-3.5 w-3.5 mr-2" />
                            Open in New Tab
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 cursor-pointer">
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
