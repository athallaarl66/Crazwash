// app/admin/orders/[id]/page.tsx
import { getOrderById } from "@/lib/orderService";
import { notFound } from "next/navigation";
import OrderDetailView from "./OrderDetailView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  const orderId = parseInt(id);

  if (isNaN(orderId)) {
    notFound();
  }

  let order;
  try {
    order = await getOrderById(orderId);
  } catch (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading order:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  return <OrderDetailView order={order} />;
}
