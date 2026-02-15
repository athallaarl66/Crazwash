// app/admin/customers/[phone]/page.tsx
import { notFound } from "next/navigation";
import {
  getCustomerByPhone,
  getOrdersByPhone,
  getCompletedPaidOrdersByPhone,
} from "@/lib/customerService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  Calendar,
  TrendingUp,
  ShoppingBag,
  Wallet,
  User,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import OrderHistoryTable from "@/app/admin/customers/components/OrderHistoryTable";
import ExportButton from "@/components/ui/export-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const statusConfig: Record<string, { color: string; label: string }> = {
  ACTIVE: {
    color: "bg-success/10 text-success border-success/20",
    label: "Aktif",
  },
  IDLE: {
    color: "bg-warning/10 text-warning border-warning/20",
    label: "Idle",
  },
  DORMANT: {
    color: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Tidak Aktif",
  },
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ phone: string }>;
}) {
  const { phone: rawPhone } = await params;
  const phone = decodeURIComponent(rawPhone);

  if (!phone || phone === "" || phone === "null" || phone.trim() === "") {
    notFound();
  }

  let customer, allOrders, completedPaidOrders;
  try {
    [customer, allOrders, completedPaidOrders] = await Promise.all([
      getCustomerByPhone(phone),
      getOrdersByPhone(phone),
      getCompletedPaidOrdersByPhone(phone),
    ]);
  } catch (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading customer:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!customer) notFound();

  const sortedOrders = allOrders
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

  const firstOrderDate = sortedOrders[0]?.createdAt ?? null;
  const lastOrderDate =
    sortedOrders[sortedOrders.length - 1]?.createdAt ?? null;

  const statusInfo = statusConfig[customer.status];
  const isNoPhoneUser = phone.startsWith("NO-PHONE-");

  const totalOrders = completedPaidOrders.length;
  const totalSpending = completedPaidOrders.reduce(
    (sum, o) => sum + Number(o.totalPrice),
    0,
  );
  const averageOrderValue = totalOrders > 0 ? totalSpending / totalOrders : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8 space-y-6">
        <Card className="card-custom">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <Link href="/admin/customers">
                  <Button variant="ghost" size="sm" className="mb-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Customers
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-chart-1 flex items-center justify-center text-primary font-bold text-xl">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-h2 text-primary">{customer.name}</h1>
                    {firstOrderDate && (
                      <p className="text-body-sm text-muted-foreground">
                        Member sejak{" "}
                        {format(new Date(firstOrderDate), "MMMM yyyy", {
                          locale: idLocale,
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {isNoPhoneUser && (
                  <Badge
                    variant="outline"
                    className="bg-warning/10 text-warning border-warning/20"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    No Phone Registered
                  </Badge>
                )}

                <div className="flex gap-2">
                  <Badge
                    className={`${statusInfo.color} border px-4 py-2 text-body-sm font-semibold`}
                  >
                    {statusInfo.label}
                  </Badge>

                  <ExportButton
                    data={{
                      customer,
                      orders: allOrders,
                      stats: { totalOrders, totalSpending, averageOrderValue },
                    }}
                    filename={`customer_${customer.phone ?? "unknown"}_${new Date().toISOString().split("T")[0]}`}
                    type="customer-detail"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-custom bg-chart-1 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary-foreground/10" />
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-chart-1-foreground/80 text-body-sm font-medium">
                    Total Pesanan
                  </p>
                  <p className="text-4xl font-bold">{totalOrders}</p>
                  <p className="text-chart-1-foreground/60 text-caption">
                    pesanan selesai & dibayar
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-custom bg-success text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary-foreground/10" />
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-success-foreground/80 text-body-sm font-medium">
                    Total Belanja
                  </p>
                  <p className="text-3xl font-bold">
                    {formatRupiah(totalSpending)}
                  </p>
                  <p className="text-success-foreground/60 text-caption">
                    akumulasi pembayaran
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Wallet className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-custom bg-chart-2 text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary-foreground/10" />
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-chart-2-foreground/80 text-body-sm font-medium">
                    Rata-rata per Order
                  </p>
                  <p className="text-3xl font-bold">
                    {formatRupiah(averageOrderValue)}
                  </p>
                  <p className="text-chart-2-foreground/60 text-caption">
                    nilai transaksi rata-rata
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-custom">
            <CardHeader className="border-b bg-muted">
              <CardTitle className="text-h4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-body-sm text-muted-foreground">
                    Nomor Telepon
                  </p>
                  <p className="font-medium">
                    {isNoPhoneUser ? (
                      <span className="text-warning">Tidak ada telepon</span>
                    ) : (
                      customer.phone
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-body-sm text-muted-foreground">Email</p>
                  <p className="font-medium">
                    {customer.email || "Tidak ada email"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-body-sm text-muted-foreground">Alamat</p>
                  <p className="font-medium">
                    {customer.address || "Tidak ada alamat"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <span className="text-muted-foreground">📍</span>
                </div>
                <div>
                  <p className="text-body-sm text-muted-foreground">Kota</p>
                  <p className="font-medium">{customer.city || "Bandung"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-custom">
            <CardHeader className="border-b bg-muted">
              <CardTitle className="text-h4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Timeline Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-body-sm text-muted-foreground">
                  Pesanan Pertama
                </p>
                <p className="font-medium">
                  {customer.firstOrderDate
                    ? format(
                        new Date(customer.firstOrderDate),
                        "dd MMMM yyyy",
                        { locale: idLocale },
                      )
                    : "-"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-body-sm text-muted-foreground">
                  Pesanan Terakhir
                </p>
                <p className="font-medium">
                  {customer.lastOrderDate
                    ? format(new Date(customer.lastOrderDate), "dd MMMM yyyy", {
                        locale: idLocale,
                      })
                    : "-"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-body-sm text-muted-foreground">
                  Total Transaksi
                </p>
                <p className="font-medium">{customer.totalOrders} pesanan</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-body-sm text-muted-foreground">
                  Status Customer
                </p>
                <Badge className={`${statusInfo.color} px-3 py-1`}>
                  {statusInfo.label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-custom">
          <CardHeader className="border-b bg-muted">
            <div className="flex items-center justify-between">
              <CardTitle className="text-h4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Riwayat Pesanan ({allOrders.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <ExportButton
                  data={allOrders}
                  filename={`orders_${customer.phone ?? "unknown"}_${new Date().toISOString().split("T")[0]}`}
                  type="orders"
                />
                <Badge
                  variant="secondary"
                  className="bg-chart-1/10 text-chart-1"
                >
                  Total {allOrders.length} pesanan
                </Badge>
                <Badge variant="outline" className="bg-success/10 text-success">
                  {completedPaidOrders.length} selesai & dibayar
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <OrderHistoryTable orders={allOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
