// app/admin/orders/page.tsx
import { Suspense } from "react";
import OrdersClient from "@/app/admin/orders/components/OrdersClient";
import { getAllOrders } from "@/lib/orderService";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type PageProps = {
  searchParams: Promise<{
    search?: string;
    payment?: PaymentStatus;
    status?: OrderStatus;
    page?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);

  const validPaymentStatus =
    params.payment && ["UNPAID", "PAID", "REFUNDED"].includes(params.payment)
      ? (params.payment as PaymentStatus)
      : undefined; // ← FIX: tambah undefined

  let result;
  try {
    result = await getAllOrders({
      search: params.search,
      paymentStatus: validPaymentStatus,
      status: params.status,
      page,
      limit: 10,
    });
  } catch (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading orders:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // The summary figures come from the service, computed over the whole filtered result
  // set. Deriving them from result.data counted only the ten rows on this page.
  const { paid, unpaid, paidRevenue } = result.summary;

  return (
    <div className="container-custom py-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-primary">Orders Management</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua pesanan dari pelanggan ShoesWash
          </p>
        </div>
      </div>
      {/* QUICK STATS */}
      {/* Every figure below counts the whole filtered result set, not the page. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-custom">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-muted-foreground">
              Total Order (sesuai filter)
            </p>
            <p className="text-2xl font-bold text-primary">{result.total}</p>
          </CardContent>
        </Card>

        <Card className="card-custom">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-muted-foreground">
              Lunas (sesuai filter)
            </p>
            <p className="text-2xl font-bold text-success">{paid}</p>
          </CardContent>
        </Card>

        <Card className="card-custom">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-muted-foreground">
              Belum Bayar (sesuai filter)
            </p>
            <p className="text-2xl font-bold text-destructive">
              {unpaid}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* MAIN CONTENT */}
      <Card className="card-custom">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-h4">Daftar Pesanan</CardTitle>
              <p className="text-body-sm text-muted-foreground mt-1">
                Menampilkan {result.data.length} dari {result.total} pesanan •
                Total lunas (sesuai filter): Rp{" "}
                {paidRevenue.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="text-body-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">
              Page {result.page} of {result.totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse h-8 bg-muted rounded w-32"></div>
              </div>
            }
          >
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
