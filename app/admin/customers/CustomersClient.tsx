"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import CustomersTable from "./components/CustomerTable";
import { Customer } from "./types";

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
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [customers, search]);

  const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpending, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          Kelola data pelanggan dan riwayat pembelian
        </p>
      </div>

      <Input
        placeholder="Cari customer (nama, email, telepon)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Total Customers" value={customers.length} />
        <Stat label="Total Orders" value={totalOrders} />
        <Stat
          label="Total Revenue"
          value={`Rp ${totalRevenue.toLocaleString("id-ID")}`}
        />
      </div>

      <CustomersTable customers={filteredCustomers} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-4 rounded-lg border bg-white">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
