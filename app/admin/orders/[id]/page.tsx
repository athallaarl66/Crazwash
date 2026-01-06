// app/admin/orders/[id]/page.tsx
import { getOrderById } from "@/lib/orderService";
import { notFound } from "next/navigation";
import OrderDetailView from "./OrderDetailView";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = parseInt(params.id);

  if (isNaN(orderId)) {
    notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <OrderDetailView order={order} />;
}
