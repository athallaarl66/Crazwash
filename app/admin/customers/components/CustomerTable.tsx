// app/admin/customers/components/CustomerTable.tsx - REMOVE ACTION COLUMN
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react"; // REMOVE Trash2
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Customer } from "../types";
// REMOVE useState

const statusColor: Record<Customer["status"], string> = {
  ACTIVE: "bg-success/10 text-success border-success/20",
  IDLE: "bg-warning/10 text-warning border-warning/20",
  DORMANT: "bg-destructive/10 text-destructive border-destructive/20",
};

const translateStatus = (status: Customer["status"]) => {
  const translations = {
    ACTIVE: "Aktif",
    IDLE: "Idle",
    DORMANT: "Tidak Aktif",
  };
  return translations[status] || status;
};

export default function CustomersTable({
  customers,
}: {
  customers: Customer[];
}) {
  // REMOVE deletingId state and handleDelete function

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-lg border overflow-x-auto shadow-soft">
      <table className="w-full text-body-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 font-semibold text-foreground">
              Customer
            </th>
            <th className="text-left p-3 font-semibold text-foreground">
              Kontak
            </th>
            <th className="text-left p-3 font-semibold text-foreground">
              Status
            </th>
            <th className="text-center p-3 font-semibold text-foreground">
              Orders
            </th>
            <th className="text-right p-3 font-semibold text-foreground">
              Total Belanja
            </th>
            <th className="text-left p-3 font-semibold text-foreground">
              Pesanan Terakhir
            </th>
            {/* REMOVE: Action column */}
          </tr>
        </thead>

        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td
                colSpan={7} // UPDATE DARI 8 KE 7
                className="py-8 text-center text-muted-foreground"
              >
                Tidak ada customer
              </td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr
                key={`${c.phone}-${c.userId}`}
                className="border-t hover:bg-muted/50"
              >
                <td className="p-3">
                  <div className="font-medium text-foreground">{c.name}</div>
                  <div className="text-caption text-muted-foreground truncate max-w-[200px]">
                    {c.email || "Tidak ada email"}
                  </div>
                </td>

                <td className="p-3">
                  <div className="font-medium text-foreground">
                    {c.phone && c.phone.startsWith("NO-PHONE-") ? (
                      <span className="text-warning italic">No Phone</span>
                    ) : (
                      c.phone || "No Phone"
                    )}
                  </div>
                  <div className="text-caption text-muted-foreground">
                    {c.city}
                  </div>
                </td>

                <td className="p-3">
                  <Badge className={statusColor[c.status]}>
                    {translateStatus(c.status)}
                  </Badge>
                </td>

                <td className="p-3 text-center font-semibold text-foreground">
                  {c.totalOrders}
                </td>

                <td className="p-3 text-right font-semibold text-foreground">
                  {formatCurrency(c.totalSpending)}
                </td>

                <td className="p-3 text-muted-foreground">
                  {formatDistanceToNow(new Date(c.lastOrderDate), {
                    addSuffix: true,
                    locale: idLocale,
                  })}
                </td>

                {/* REMOVE: Action td */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
