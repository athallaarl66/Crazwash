// app/admin/customers/components/CustomersClient.tsx
"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import CustomersTable from "./CustomerTable";
import { Customer } from "../types";
import ExportButton from "@/components/ui/export-button";

export default function CustomersClient({
  customers,
}: {
  customers: Customer[];
}) {
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.phone.includes(q),
    );
  }, [customers, search]);

  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpending, 0);

  return (
    <div className="container-custom py-8 space-y-6">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-h2 text-primary">Customers</h1>
          <p className="text-muted-foreground">
            Kelola data pelanggan dan riwayat pembelian
          </p>
        </div>

        <ExportButton
          data={customers}
          filename={`customers_${new Date().toISOString().split("T")[0]}`}
          type="customers"
        />
      </div>

      <Input
        placeholder="Cari customer (nama, email, telepon)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-custom">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-muted-foreground">
              Total Customers
            </p>
            <p className="text-2xl font-bold text-primary">
              {customers.length}
            </p>
          </CardContent>
        </Card>
        <Card className="card-custom">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-muted-foreground">
              Total Orders
            </p>
            <p className="text-2xl font-bold text-primary">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="card-custom">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-muted-foreground">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-primary">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>
      </div>

      <CustomersTable customers={filteredCustomers} />
    </div>
  );
}
