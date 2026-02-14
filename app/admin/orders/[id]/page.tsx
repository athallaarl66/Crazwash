// app/admin/orders/[id]/page.tsx
import { getOrderById } from "@/lib/orderService";
import { notFound } from "next/navigation";
import OrderDetailView from "./OrderDetailView";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  // Next.js 15: params adalah Promise
  const { id } = await params;

  const orderId = parseInt(id);

  if (isNaN(orderId)) {
    notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <OrderDetailView order={order} />;
}
