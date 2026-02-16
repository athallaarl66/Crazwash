// components/ui/export-button.tsx - UPDATED
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
  data: any;
  filename: string;
  type: "customers" | "orders" | "customer-detail";
}

export default function ExportButton({
  data,
  filename,
  type,
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const exportToCSV = () => {
    setLoading(true);
    try {
      let csvContent = "";
      let headers: string[] = [];
      let rows: any[] = [];

      switch (type) {
        case "customers":
          headers = [
            "Nama",
            "Email",
            "Phone",
            "Alamat",
            "Kota",
            "Total Orders",
            "Total Spending",
            "Status",
            "Last Order",
          ];
          rows = data.map((c: any) => [
            c.name,
            c.email,
            c.phone,
            c.address,
            c.city,
            c.totalOrders,
            c.totalSpending,
            c.status,
            new Date(c.lastOrderDate).toLocaleDateString("id-ID"),
          ]);
          break;

        case "orders":
          headers = [
            "Order Number",
            "Tanggal",
            "Total",
            "Status",
            "Payment Status",
            "Pickup Date",
          ];
          rows = data.map((o: any) => [
            o.orderNumber,
            new Date(o.createdAt).toLocaleDateString("id-ID"),
            o.totalPrice.toLocaleString("id-ID"),
            o.status,
            o.paymentStatus,
            o.pickupDate
              ? new Date(o.pickupDate).toLocaleDateString("id-ID")
              : "-",
          ]);
          break;

        case "customer-detail":
          headers = ["Field", "Value"];
          rows = [
            ["Nama", data.customer.name],
            ["Email", data.customer.email || "-"],
            ["Phone", data.customer.phone],
            ["Alamat", data.customer.address],
            ["Kota", data.customer.city],
            ["Total Orders", data.stats.totalOrders],
            [
              "Total Spending",
              "Rp " + data.stats.totalSpending.toLocaleString("id-ID"),
            ],
            [
              "Average Order Value",
              "Rp " + data.stats.averageOrderValue.toLocaleString("id-ID"),
            ],
            [
              "First Order",
              new Date(data.customer.firstOrderDate).toLocaleDateString(
                "id-ID",
              ),
            ],
            [
              "Last Order",
              new Date(data.customer.lastOrderDate).toLocaleDateString("id-ID"),
            ],
          ];
          break;
      }

      csvContent = headers.join(",") + "\n";

      rows.forEach((row) => {
        csvContent +=
          row
            .map((cell: any) =>
              typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : cell,
            )
            .join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Gagal mengexport data");
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    setLoading(true);
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Gagal mengexport data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          suppressHydrationWarning // ← TAMBAH INI
        >
          <Download className="h-4 w-4 mr-2" />
          {loading ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
