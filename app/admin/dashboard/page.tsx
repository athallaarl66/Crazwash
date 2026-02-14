// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Calendar, Wallet, ShoppingBag, Users, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StatCard from "./components/StatsCard";
import RevenueChart from "./components/RevenueChart";
import OrderStatusChart from "./components/OrderStatusChart";
import TopProducts from "./components/TopProductsTable";
import RevenueBreakdown from "./components/Revenuebreakdown";
import CustomerStats from "./components/Customerstats";
import CategoryBreakdown from "./components/Categorybreakdown";
import SectionHeader from "./components/SectionHeader";

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
  const [range, setRange] = useState("30d");

  useEffect(() => {
    load();
  }, [range]);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/dashboard?range=${range}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(v);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading dashboard…
      </div>
    );

  if (!data) return <div className="p-8">Data kosong</div>;

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-gray-500">Analisis Bisnis Cuci Sepatu</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
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

      {/* KPI CARDS */}
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
          subtitle={`Rata-rata ${(
            data.kpis.totalShoesCleaned.value / data.kpis.totalOrders.value || 0
          ).toFixed(1)} sepatu/order`}
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

      {/* REVENUE & STATUS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          data={data.charts.revenueTrends}
          formatCurrency={formatCurrency}
        />
        <OrderStatusChart data={data.charts.statusDistribution} />
      </div>

      {/* REVENUE BREAKDOWN & CUSTOMER STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueBreakdown
          data={data.revenueBreakdown}
          formatCurrency={formatCurrency}
        />
        <CustomerStats data={data.customerStats} />
      </div>

      {/* TOP PRODUCTS */}
      <SectionHeader title="Layanan Terlaris" />
      <TopProducts data={data.topProducts} />

      {/* CATEGORY BREAKDOWN */}
      <SectionHeader title="Breakdown per Kategori" />
      <CategoryBreakdown
        data={data.categoryBreakdown}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
