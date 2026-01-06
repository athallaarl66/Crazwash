// app/admin/orders/page.tsx
import { getAllOrders } from "@/lib/orderService";
import OrdersClient from "./OrdersClient";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="p-6 space-y-6">
      <OrdersClient orders={orders} />
    </div>
  );
}
