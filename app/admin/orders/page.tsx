// app/(admin)/orders/page.tsx

import { Suspense } from "react";
import OrdersClient from "@/app/admin/orders/components/OrdersClient";
import { getAllOrders } from "@/lib/orderService";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, BarChart } from "lucide-react";

type PageProps = {
  searchParams?: {
    search?: string;
    payment?: PaymentStatus;
    status?: OrderStatus;
    page?: string;
  };
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = searchParams ?? {};

  const page = Number(params.page ?? 1);

  const validPaymentStatus =
    params.payment && ["UNPAID", "PAID", "REFUNDED"].includes(params.payment)
      ? (params.payment as PaymentStatus)
      : undefined;

  const result = await getAllOrders({
    search: params.search,
    paymentStatus: validPaymentStatus,
    status: params.status,
    page,
    limit: 10,
  });

  const paidOrders = result.data.filter(
    (o) => o.paymentStatus === "PAID",
  ).length;

  const unpaidOrders = result.data.filter(
    (o) => o.paymentStatus === "UNPAID",
  ).length;

  const totalRevenue = result.data
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, order) => sum + Number(order.totalPrice), 0);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pesanan dari pelanggan ShoesWash
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Order Baru
          </Button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold">{result.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium">Lunas</p>
            <p className="text-2xl font-bold">{paidOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium">Belum Bayar</p>
            <p className="text-2xl font-bold">{unpaidOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN CONTENT */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Daftar Pesanan</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Menampilkan {result.data.length} dari {result.total} pesanan •
                Revenue: Rp {totalRevenue.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="text-sm text-muted-foreground bg-gray-50 px-3 py-1 rounded-md">
              Page {result.page} of {result.totalPages}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Suspense fallback={<div>Loading...</div>}>
            <OrdersClient
              orders={result.data}
              page={result.page}
              totalPages={result.totalPages}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
