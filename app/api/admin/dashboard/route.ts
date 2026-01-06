import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";
    const { currentPeriodStart, previousPeriodStart, previousPeriodEnd } =
      getDateRanges(range);

    // 1. KPI
    const currentAgg = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      _count: true,
      where: { createdAt: { gte: currentPeriodStart }, paymentStatus: "PAID" },
    });
    const previousAgg = await prisma.order.aggregate({
      _sum: { totalPrice: true },
      _count: true,
      where: {
        createdAt: { gte: previousPeriodStart, lte: previousPeriodEnd },
        paymentStatus: "PAID",
      },
    });

    const totalRevenue = Number(currentAgg._sum.totalPrice) || 0;
    const totalOrders = currentAgg._count;
    const lastPeriodRevenue = Number(previousAgg._sum.totalPrice) || 0;
    const lastPeriodOrders = previousAgg._count;
    const revenueGrowth =
      lastPeriodRevenue > 0
        ? ((totalRevenue - lastPeriodRevenue) / lastPeriodRevenue) * 100
        : 0;
    const ordersGrowth =
      lastPeriodOrders > 0
        ? ((totalOrders - lastPeriodOrders) / lastPeriodOrders) * 100
        : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 2. Active Customers
    const activeCustomers = await prisma.order.groupBy({
      by: ["customerPhone"],
      where: {
        createdAt: { gte: currentPeriodStart },
        status: { not: "CANCELLED" },
      },
    });

    // 3. Revenue Trends
    const revenueTrends = await getRevenueTrends(currentPeriodStart);

    // 4. Order Status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
      where: { createdAt: { gte: currentPeriodStart } },
    });
    const statusDistribution = ordersByStatus.map((s) => ({
      status: s.status,
      count: s._count,
    }));

    // 5. Payment Breakdown
    const ordersByPayment = await prisma.order.groupBy({
      by: ["paymentStatus"],
      _sum: { totalPrice: true },
      _count: true,
      where: { createdAt: { gte: currentPeriodStart } },
    });
    const paymentBreakdown = ordersByPayment.map((p) => ({
      status: p.paymentStatus,
      amount: Number(p._sum.totalPrice) || 0,
      count: p._count,
    }));

    // 6. Category Performance
    const categoryPerformance = await getCategoryPerformance(
      currentPeriodStart
    );

    // 7. Top Products
    const topProducts = await getTopProducts(currentPeriodStart);

    // 8. Recent Orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { items: { include: { product: true } } },
    });

    // 9. Alerts
    const [pendingOrders, unpaidOrders, pendingVerification] =
      await Promise.all([
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({
          where: { status: { not: "CANCELLED" }, paymentStatus: "UNPAID" },
        }),
        prisma.order.count({
          where: { paymentStatus: "UNPAID", paymentProof: { not: null } },
        }),
      ]);
    const lowStockProducts = await prisma.product.count({
      where: { isActive: true, stock: { lte: 10 } },
    });

    return NextResponse.json({
      kpis: {
        totalRevenue: {
          value: totalRevenue,
          growth: revenueGrowth,
          lastMonth: lastPeriodRevenue,
        },
        totalOrders: {
          value: totalOrders,
          growth: ordersGrowth,
          lastMonth: lastPeriodOrders,
        },
        activeCustomers: { value: activeCustomers.length },
        averageOrderValue: { value: averageOrderValue },
      },
      charts: {
        revenueTrends,
        statusDistribution,
        paymentBreakdown,
        categoryPerformance,
      },
      topProducts,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        totalPrice: Number(o.totalPrice),
        status: o.status,
        createdAt: o.createdAt,
      })),
      alerts: {
        pendingOrders,
        unpaidOrders,
        pendingVerification,
        lowStockProducts,
      },
      metrics: {
        avgProcessingTime: "2", // placeholder, bisa dihitung dari order logic
        cancellationRate: 5,
        completionRate: "95",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Dashboard error" }, { status: 500 });
  }
}

/* ================= HELPERS ================= */
function getDateRanges(range: string) {
  const now = new Date();
  const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
  const days = daysMap[range];
  if (days)
    return {
      currentPeriodStart: new Date(now.getTime() - days * 86400000),
      previousPeriodStart: new Date(now.getTime() - days * 2 * 86400000),
      previousPeriodEnd: new Date(now.getTime() - days * 86400000),
    };
  return {
    currentPeriodStart: new Date(0),
    previousPeriodStart: new Date(0),
    previousPeriodEnd: new Date(0),
  };
}

async function getRevenueTrends(startDate: Date) {
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startDate }, paymentStatus: "PAID" },
    orderBy: { createdAt: "asc" },
  });
  const map = new Map<string, number>();
  orders.forEach((o) => {
    const key = o.createdAt.toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    });
    map.set(key, (map.get(key) ?? 0) + Number(o.totalPrice));
  });
  return Array.from(map.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

async function getCategoryPerformance(startDate: Date) {
  const items = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: startDate }, paymentStatus: "PAID" } },
    include: { product: true },
  });
  const map = new Map<string, number>();
  items.forEach((i) => {
    map.set(
      i.product.category,
      (map.get(i.product.category) ?? 0) + Number(i.unitPrice) * i.quantity
    );
  });
  return Array.from(map.entries()).map(([category, revenue]) => ({
    category,
    revenue,
  }));
}

async function getTopProducts(startDate: Date) {
  const items = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: startDate }, paymentStatus: "PAID" } },
    include: { product: true },
  });
  const map = new Map<
    number,
    { name: string; category: string; revenue: number; quantity: number }
  >();
  items.forEach((i) => {
    if (!map.has(i.productId))
      map.set(i.productId, {
        name: i.product.name,
        category: i.product.category,
        revenue: 0,
        quantity: 0,
      });
    const p = map.get(i.productId)!;
    p.revenue += Number(i.unitPrice) * i.quantity;
    p.quantity += i.quantity;
  });
  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}
