"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  search: string;
  status: "ALL" | "PAID" | "UNPAID";
  onSearchChange: (v: string) => void;
  onStatusChange: (v: "ALL" | "PAID" | "UNPAID") => void;
};

export default function OrderFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
      <Input
        placeholder="Cari order / customer"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:max-w-sm"
      />

      <div className="flex gap-2">
        {["ALL", "UNPAID", "PAID"].map((s) => (
          <Button
            key={s}
            variant={status === s ? "default" : "outline"}
            onClick={() => onStatusChange(s as any)}
          >
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}
