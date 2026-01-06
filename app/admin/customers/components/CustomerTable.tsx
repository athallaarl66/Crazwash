import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Customer } from "../types";

const statusColor: Record<Customer["status"], string> = {
  ACTIVE: "bg-green-100 text-green-700",
  IDLE: "bg-yellow-100 text-yellow-700",
  DORMANT: "bg-red-100 text-red-700",
};

export default function CustomersTable({
  customers,
}: {
  customers: Customer[];
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Kontak</th>
            <th className="text-left p-3">Status</th>
            <th className="text-center p-3">Orders</th>
            <th className="text-right p-3">Spending</th>
            <th className="text-left p-3">Last Order</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-8 text-center text-muted-foreground"
              >
                Tidak ada customer
              </td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id} className="border-t hover:bg-muted/30">
                <td className="p-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-muted-foreground">{c.email}</div>
                </td>

                <td className="p-3">{c.phone}</td>

                <td className="p-3">
                  <Badge className={statusColor[c.status]}>{c.status}</Badge>
                </td>

                <td className="p-3 text-center">{c.totalOrders}</td>

                <td className="p-3 text-right font-semibold">
                  Rp {c.totalSpending.toLocaleString("id-ID")}
                </td>

                <td className="p-3 text-muted-foreground">
                  {formatDistanceToNow(c.lastOrderDate, {
                    addSuffix: true,
                    locale: idLocale,
                  })}
                </td>

                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
