// app/admin/customers/components/CustomerTable.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Customer } from "../types";

const statusColor: Record<Customer["status"], string> = {
  ACTIVE: "bg-green-100 text-green-700",
  IDLE: "bg-yellow-100 text-yellow-700",
  DORMANT: "bg-red-100 text-red-700",
};

// Terjemahan status
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Kontak</th>
            <th className="text-left p-3">Status</th>
            <th className="text-center p-3">Orders</th>
            <th className="text-right p-3">Total Belanja</th>
            <th className="text-left p-3">Pesanan Terakhir</th>
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
              // ✅ FIX: PAKE COMPOSITE KEY DENGAN userId
              <tr
                key={`${c.phone}-${c.userId}`}
                className="border-t hover:bg-muted/30"
              >
                <td className="p-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-muted-foreground text-xs truncate max-w-[200px]">
                    {c.email || "Tidak ada email"}
                  </div>
                </td>

                <td className="p-3">
                  <div className="font-medium">
                    {/* 🚨 TAMPILKAN "NO PHONE" JIKA PAKE FORMAT NO-PHONE- */}
                    {c.phone && c.phone.startsWith("NO-PHONE-") ? (
                      <span className="text-amber-600 italic">No Phone</span>
                    ) : (
                      c.phone || "No Phone"
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{c.city}</div>
                </td>

                <td className="p-3">
                  <Badge className={statusColor[c.status]}>
                    {translateStatus(c.status)}
                  </Badge>
                </td>

                <td className="p-3 text-center font-semibold">
                  {c.totalOrders}
                </td>

                <td className="p-3 text-right font-semibold">
                  {formatCurrency(c.totalSpending)}
                </td>

                <td className="p-3 text-muted-foreground">
                  {formatDistanceToNow(new Date(c.lastOrderDate), {
                    addSuffix: true,
                    locale: idLocale,
                  })}
                </td>

                <td className="p-3 text-right">
                  <Link
                    href={`/admin/customers/${encodeURIComponent(c.phone)}`}
                  >
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
