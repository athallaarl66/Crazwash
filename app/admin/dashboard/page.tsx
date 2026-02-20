// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import {
  Calendar,
  Wallet,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StatCard from "./components/StatsCard";
import TopProducts from "./components/TopProductsTable";
import RevenueBreakdown from "./components/Revenuebreakdown";
import CustomerStats from "./components/Customerstats";
import CategoryBreakdown from "./components/Categorybreakdown";
import SectionHeader from "./components/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Lazy load heavy charts
const RevenueChart = lazy(() => import("./components/RevenueChart"));
const OrderStatusChart = lazy(() => import("./components/OrderStatusChart"));

interface DashboardData {
  kpis: {
    totalRevenue: { value: number; growth: number };
    totalOrders: { value: number; growth: number };
    totalShoesCleaned: { value: number };
    activeCustomers: { value: number };
    averageOrderValue: { value: number };
  };
  revenueBreakdown: {
    status: string;
    amount: number;
    count: number;
  }[];
  customerStats: {
    total: number;
    new: number;
    returning: number;
    active: number;
  };
  categoryBreakdown: {
    category: string;
    revenue: number;
    orderCount: number;
  }[];
  charts: {
    revenueTrends: { month: string; revenue: number }[];
    statusDistribution: { status: string; count: number }[];
  };
  topProducts: {
    name: string;
    category: string;
    orderCount: number;
    totalShoes: number;
    revenue: number;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    load();
  }, [range]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/dashboard?range=${range}`);
      if (!res.ok) throw new Error("Failed to load data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(v);

  if (loading) {
    return (
      <div className="container-custom py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading dashboard: {error}.{" "}
            <button onClick={load} className="underline">
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data)
    return (
      <div className="container-custom py-8 text-muted-foreground">
        Data kosong
      </div>
    );

  return (
    <div className="container-custom py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-h2 text-primary">Dashboard Admin</h1>
          <p className="text-muted-foreground">Analisis Bisnis Cuci Sepatu</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="90d">90 Hari</SelectItem>
              <SelectItem value="6m">6 Bulan</SelectItem>
              <SelectItem value="1y">1 Tahun</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Penjualan"
          value={formatCurrency(data.kpis.totalRevenue.value)}
          subtitle={`${data.kpis.totalOrders.value} order • ${data.kpis.totalShoesCleaned.value} sepatu dicuci`}
          growth={data.kpis.totalRevenue.growth}
          icon={<Wallet className="h-4 w-4" />}
          variant="success"
        />
        <StatCard
          title="Total Pesanan"
          value={data.kpis.totalOrders.value}
          subtitle={`Rata-rata ${(data.kpis.totalShoesCleaned.value / data.kpis.totalOrders.value || 0).toFixed(1)} sepatu/order`}
          growth={data.kpis.totalOrders.growth}
          icon={<ShoppingBag className="h-4 w-4" />}
          variant="info"
        />
        <StatCard
          title="Pelanggan Aktif"
          value={data.kpis.activeCustomers.value}
          subtitle={`dari ${data.customerStats.total} total pelanggan`}
          icon={<Users className="h-4 w-4" />}
          variant="default"
        />
        <StatCard
          title="Rata-rata Pesanan"
          value={formatCurrency(data.kpis.averageOrderValue.value)}
          subtitle={`Per ${data.kpis.totalOrders.value} order`}
          icon={<TrendingUp className="h-4 w-4" />}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <RevenueChart
            data={data.charts.revenueTrends}
            formatCurrency={formatCurrency}
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <OrderStatusChart data={data.charts.statusDistribution} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueBreakdown
          data={data.revenueBreakdown}
          formatCurrency={formatCurrency}
        />
        <CustomerStats data={data.customerStats} />
      </div>

      <SectionHeader title="Layanan Terlaris" />
      <TopProducts data={data.topProducts} />

      <SectionHeader title="Breakdown per Kategori" />
      <CategoryBreakdown
        data={data.categoryBreakdown}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
