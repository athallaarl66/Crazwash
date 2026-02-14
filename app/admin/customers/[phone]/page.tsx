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

// Status config
const statusConfig: Record<string, { color: string; label: string }> = {
  ACTIVE: {
    color: "bg-green-100 text-green-700 border-green-200",
    label: "Aktif",
  },
  IDLE: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    label: "Idle",
  },
  DORMANT: {
    color: "bg-red-100 text-red-700 border-red-200",
    label: "Tidak Aktif",
  },
};

// Format Rupiah
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

  // 🚨 VALIDASI: Phone tidak boleh kosong
  if (
    !phone ||
    phone === "undefined" ||
    phone === "null" ||
    phone.trim() === ""
  ) {
    notFound();
  }

  // Ambil data
  const [customer, allOrders, completedPaidOrders] = await Promise.all([
    getCustomerByPhone(phone),
    getOrdersByPhone(phone),
    getCompletedPaidOrdersByPhone(phone),
  ]);

  if (!customer) notFound();

  // Sort orders by createdAt
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

  // Stats
  const totalOrders = completedPaidOrders.length;
  const totalSpending = completedPaidOrders.reduce(
    (sum, o) => sum + Number(o.totalPrice),
    0,
  );
  const averageOrderValue = totalOrders > 0 ? totalSpending / totalOrders : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-3">
              <Link href="/admin/customers">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Customers
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {customer.name}
                  </h1>
                  {firstOrderDate && (
                    <p className="text-sm text-slate-600">
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
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  No Phone Registered
                </Badge>
              )}

              <div className="flex gap-2">
                <Badge
                  className={`${statusInfo.color} border px-4 py-2 text-sm font-semibold`}
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
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-100 text-sm font-medium">
                    Total Pesanan
                  </p>
                  <p className="text-4xl font-bold">{totalOrders}</p>
                  <p className="text-blue-100 text-xs">
                    pesanan selesai & dibayar
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-green-100 text-sm font-medium">
                    Total Belanja
                  </p>
                  <p className="text-3xl font-bold">
                    {formatRupiah(totalSpending)}
                  </p>
                  <p className="text-green-100 text-xs">akumulasi pembayaran</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10" />
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-purple-100 text-sm font-medium">
                    Rata-rata per Order
                  </p>
                  <p className="text-3xl font-bold">
                    {formatRupiah(averageOrderValue)}
                  </p>
                  <p className="text-purple-100 text-xs">
                    nilai transaksi rata-rata
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ✅ FIX: CONTACT INFO & TIMELINE (LENGKAPIN YANG KOSONG) */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Info Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Nomor Telepon</p>
                  <p className="font-medium">
                    {isNoPhoneUser ? (
                      <span className="text-amber-600">Tidak ada telepon</span>
                    ) : (
                      customer.phone
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium">
                    {customer.email || "Tidak ada email"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Alamat</p>
                  <p className="font-medium">
                    {customer.address || "Tidak ada alamat"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <span className="text-slate-400">📍</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Kota</p>
                  <p className="font-medium">{customer.city || "Bandung"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Timeline Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Pesanan Pertama</p>
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
                <p className="text-sm text-slate-600">Pesanan Terakhir</p>
                <p className="font-medium">
                  {customer.lastOrderDate
                    ? format(new Date(customer.lastOrderDate), "dd MMMM yyyy", {
                        locale: idLocale,
                      })
                    : "-"}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Total Transaksi</p>
                <p className="font-medium">{customer.totalOrders} pesanan</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Status Customer</p>
                <Badge className={`${statusInfo.color} px-3 py-1`}>
                  {statusInfo.label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order History Table */}
        <Card className="shadow-lg border-0">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
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
                  className="bg-blue-100 text-blue-700"
                >
                  Total {allOrders.length} pesanan
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
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
