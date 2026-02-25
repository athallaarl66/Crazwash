// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

/* ================== GET ================== */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    const { currentPeriodStart, previousPeriodStart, previousPeriodEnd } =
      getDateRanges(range);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    /* ================= KPI ================= */
    const currentAgg = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      _count: true,
      where: {
        createdAt: { gte: currentPeriodStart },
        paymentStatus: "PAID",
      },
    });

    const previousAgg = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      _count: true,
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd,
        },
        paymentStatus: "PAID",
      },
    });

    const totalRevenue = Number(currentAgg._sum.totalPrice) || 0;
    const totalOrders = currentAgg._count || 0;
    const lastRevenue = Number(previousAgg._sum.totalPrice) || 0;
    const lastOrders = previousAgg._count || 0;

    const revenueGrowth =
      lastRevenue > 0 ? ((totalRevenue - lastRevenue) / lastRevenue) * 100 : 0;

    const ordersGrowth =
      lastOrders > 0 ? ((totalOrders - lastOrders) / lastOrders) * 100 : 0;

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    /* ============ TOTAL SHOES COUNT ============ */
    const shoesAgg = await prisma.orderService.aggregate({
      _sum: { shoesQty: true },
      where: {
        order: {
          createdAt: { gte: currentPeriodStart },
          paymentStatus: "PAID",
        },
      },
    });

    const totalShoesCleaned = shoesAgg._sum.shoesQty || 0;

    /* ============ ACTIVE CUSTOMERS ============ */
    const activeCustomers = await prisma.order.groupBy({
      by: ["customerPhone"],
      where: {
        createdAt: { gte: currentPeriodStart },
        status: { not: "CANCELLED" },
      },
    });

    /* ================= ALERTS ================= */
    const pendingCount = await prisma.order.count({
      where: { status: "PENDING" },
    });

    const unpaidWithProofCount = await prisma.order.count({
      where: {
        paymentStatus: "UNPAID",
        paymentProof: { not: null },
      },
    });

    const readyCount = await prisma.order.count({
      where: { status: "READY" },
    });

    const pickupTodayCount = await prisma.order.count({
      where: {
        pickupDate: { gte: today, lt: tomorrow },
        status: "CONFIRMED",
      },
    });

    /* ================= TODAY'S ACTIVITY ================= */
    const newOrdersToday = await prisma.order.count({
      where: {
        createdAt: { gte: today },
      },
    });

    const inProgressOrders = await prisma.order.findMany({
      where: { status: "IN_PROGRESS" },
      include: {
        services: {
          select: { shoesQty: true },
        },
      },
    });

    const inProgressCount = inProgressOrders.length;
    const inProgressShoes = inProgressOrders.reduce(
      (sum, order) =>
        sum + order.services.reduce((s, svc) => s + svc.shoesQty, 0),
      0,
    );

    const completedToday = await prisma.order.count({
      where: {
        completedDate: { gte: today },
        status: "COMPLETED",
      },
    });

    /* ================= REVENUE BREAKDOWN ================= */
    const revenueByPaymentStatus = await prisma.order.groupBy({
      by: ["paymentStatus"],
      _sum: { totalPrice: true },
      _count: true,
      where: { createdAt: { gte: currentPeriodStart } },
    });

    const revenueBreakdown = revenueByPaymentStatus.map((item) => ({
      status: item.paymentStatus,
      amount: Number(item._sum.totalPrice) || 0,
      count: item._count,
    }));

    /* ================= CUSTOMER STATS ================= */
    const allCustomers = await prisma.order.groupBy({
      by: ["customerPhone"],
      _count: true,
      where: { createdAt: { gte: currentPeriodStart } },
    });

    const newCustomers = allCustomers.filter((c) => c._count === 1).length;
    const returningCustomers = allCustomers.filter((c) => c._count > 1).length;

    /* ================= CATEGORY BREAKDOWN ================= */
    const categoryBreakdown = await getCategoryBreakdown(currentPeriodStart);

    /* ================= CHARTS ================= */
    const revenueTrends = await getRevenueTrends(currentPeriodStart);

    const statusRaw = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
      where: { createdAt: { gte: currentPeriodStart } },
    });

    const statusDistribution = statusRaw.map((s) => ({
      status: s.status,
      count: s._count,
    }));

    /* ================= TOP PRODUCTS ================= */
    const topProducts = await getTopProducts(currentPeriodStart);

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      kpis: {
        totalRevenue: {
          value: totalRevenue,
          growth: revenueGrowth,
        },
        totalOrders: {
          value: totalOrders,
          growth: ordersGrowth,
        },
        totalShoesCleaned: {
          value: totalShoesCleaned,
        },
        activeCustomers: {
          value: activeCustomers.length,
        },
        averageOrderValue: {
          value: averageOrderValue,
        },
      },
      alerts: {
        pending: pendingCount,
        unpaidWithProof: unpaidWithProofCount,
        ready: readyCount,
        pickupToday: pickupTodayCount,
      },
      todayActivity: {
        newOrders: newOrdersToday,
        inProgress: {
          orders: inProgressCount,
          shoes: inProgressShoes,
        },
        completed: completedToday,
        needPickup: pickupTodayCount,
      },
      revenueBreakdown,
      customerStats: {
        total: allCustomers.length,
        new: newCustomers,
        returning: returningCustomers,
        active: activeCustomers.length,
      },
      categoryBreakdown,
      charts: {
        revenueTrends,
        statusDistribution,
      },
      topProducts,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);

    return NextResponse.json({
      kpis: {
        totalRevenue: { value: 0, growth: 0 },
        totalOrders: { value: 0, growth: 0 },
        totalShoesCleaned: { value: 0 },
        activeCustomers: { value: 0 },
        averageOrderValue: { value: 0 },
      },
      alerts: {
        pending: 0,
        unpaidWithProof: 0,
        ready: 0,
        pickupToday: 0,
      },
      todayActivity: {
        newOrders: 0,
        inProgress: { orders: 0, shoes: 0 },
        completed: 0,
        needPickup: 0,
      },
      revenueBreakdown: [],
      customerStats: {
        total: 0,
        new: 0,
        returning: 0,
        active: 0,
      },
      categoryBreakdown: [],
      charts: {
        revenueTrends: [],
        statusDistribution: [],
      },
      topProducts: [],
    });
  }
}

/* ================== HELPERS ================== */

function getDateRanges(range: string) {
  const now = new Date();

  switch (range) {
    case "7d":
      return rangeDays(now, 7);
    case "30d":
      return rangeDays(now, 30);
    case "90d":
      return rangeDays(now, 90);
    case "6m":
      return rangeDays(now, 180);
    case "1y":
      return rangeDays(now, 365);
    default:
      return {
        currentPeriodStart: new Date(0),
        previousPeriodStart: new Date(0),
        previousPeriodEnd: new Date(0),
      };
  }
}

function rangeDays(now: Date, days: number) {
  return {
    currentPeriodStart: new Date(now.getTime() - days * 86400000),
    previousPeriodStart: new Date(now.getTime() - days * 2 * 86400000),
    previousPeriodEnd: new Date(now.getTime() - days * 86400000),
  };
}

/* ================== REVENUE TRENDS ================== */
async function getRevenueTrends(startDate: Date) {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      paymentStatus: "PAID",
    },
    orderBy: { createdAt: "asc" },
  });

  // Map revenue per tanggal dari order yang ada
  const map = new Map<string, number>();

  orders.forEach((o) => {
    const key = o.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
    map.set(key, (map.get(key) ?? 0) + Number(o.totalPrice));
  });

  // Hitung jumlah hari dari startDate sampai hari ini
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffMs / 86400000);

  // Kalau range pendek (<=14 hari) → isi semua hari
  // Kalau range panjang (>14 hari) → group per minggu biar ga penuh
  if (diffDays <= 14) {
    const result: { month: string; revenue: number }[] = [];

    for (let i = 0; i < diffDays; i++) {
      const date = new Date(startDate.getTime() + i * 86400000);
      const key = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      result.push({ month: key, revenue: map.get(key) ?? 0 });
    }

    return result;
  }

  // Range panjang: group per minggu
  const weekMap = new Map<string, number>();

  for (let i = 0; i < diffDays; i++) {
    const date = new Date(startDate.getTime() + i * 86400000);

    // Label: "W1 Jan", "W2 Jan", dll
    const weekNum = Math.floor(i / 7) + 1;
    const monthLabel = date.toLocaleDateString("id-ID", { month: "short" });
    const key = `W${weekNum} ${monthLabel}`;

    const dayKey = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

    weekMap.set(key, (weekMap.get(key) ?? 0) + (map.get(dayKey) ?? 0));
  }

  return Array.from(weekMap.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

/* ================== TOP PRODUCTS ================== */
async function getTopProducts(startDate: Date) {
  const services = await prisma.orderService.findMany({
    where: {
      order: {
        createdAt: { gte: startDate },
        paymentStatus: "PAID",
      },
    },
    include: {
      product: true,
      order: true,
    },
  });

  const map = new Map<
    number,
    {
      name: string;
      category: string;
      revenue: number;
      totalShoes: number;
      orderCount: number;
      orderIds: Set<number>;
    }
  >();

  services.forEach((s) => {
    if (!map.has(s.productId)) {
      map.set(s.productId, {
        name: s.product.name,
        category: s.product.category,
        revenue: 0,
        totalShoes: 0,
        orderCount: 0,
        orderIds: new Set(),
      });
    }

    const p = map.get(s.productId)!;
    p.revenue += Number(s.subtotal);
    p.totalShoes += s.shoesQty;
    p.orderIds.add(s.orderId);
  });

  return Array.from(map.values())
    .map(({ orderIds, ...rest }) => ({
      ...rest,
      orderCount: orderIds.size,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

/* ================== CATEGORY BREAKDOWN ================== */
async function getCategoryBreakdown(startDate: Date) {
  const services = await prisma.orderService.findMany({
    where: {
      order: {
        createdAt: { gte: startDate },
        paymentStatus: "PAID",
      },
    },
    include: {
      product: true,
      order: true,
    },
  });

  const map = new Map<
    string,
    {
      category: string;
      revenue: number;
      orderCount: number;
      orderIds: Set<number>;
    }
  >();

  services.forEach((s) => {
    const category = s.product.category;

    if (!map.has(category)) {
      map.set(category, {
        category,
        revenue: 0,
        orderCount: 0,
        orderIds: new Set(),
      });
    }

    const cat = map.get(category)!;
    cat.revenue += Number(s.subtotal);
    cat.orderIds.add(s.orderId);
  });

  return Array.from(map.values())
    .map(({ orderIds, ...rest }) => ({
      ...rest,
      orderCount: orderIds.size,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}
