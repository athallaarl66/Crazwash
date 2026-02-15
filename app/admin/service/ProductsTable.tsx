// app/admin/service/ProductsTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, MoreVertical, Trash2, Eye, EyeOff } from "lucide-react";
import { ProductCategory } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: ProductCategory;
  duration: number;
  isActive: boolean;
  createdAt: string;
}

interface ProductsTableProps {
  products: Product[];
  onRefresh?: () => void;
  selected?: number[];
  setSelected?: (ids: number[]) => void;
}

export default function ProductsTable({
  products,
  onRefresh,
  selected = [],
  setSelected,
}: ProductsTableProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    productId: number | null;
    productName: string;
  }>({ open: false, productId: null, productName: "" });

  const handleDelete = async () => {
    if (!deleteDialog.productId) return;
    try {
      const res = await fetch(`/api/admin/service/${deleteDialog.productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onRefresh?.();
        setDeleteDialog({ open: false, productId: null, productName: "" });
      } else {
        alert("Gagal hapus");
      }
    } catch {
      alert("Error");
    }
  };

  const handleToggleStatus = async (id: number, status: boolean) => {
    try {
      const res = await fetch(`/api/admin/service/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !status }),
      });
      if (res.ok) onRefresh?.();
      else alert("Gagal ubah status");
    } catch {
      alert("Error");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected?.(checked ? products.map((p) => p.id) : []);
  };

  const handleSelect = (id: number, checked: boolean) => {
    setSelected?.(
      checked ? [...selected, id] : selected.filter((s) => s !== id),
    );
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !confirm("Hapus yang dipilih?")) return;
    try {
      await fetch("/api/admin/service/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      onRefresh?.();
      setSelected?.([]);
    } catch {
      alert("Error bulk delete");
    }
  };

  return (
    <>
      {selected.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-body-sm text-muted-foreground">
            {selected.length} dipilih
          </span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Hapus
          </Button>
        </div>
      )}

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-body-sm">
          <thead className="bg-muted">
            <tr>
              {setSelected && (
                <th className="p-3">
                  <Checkbox
                    checked={
                      selected.length === products.length && products.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              <th className="text-left p-3 font-medium text-foreground">
                Nama Layanan
              </th>
              <th className="text-left p-3 font-medium text-foreground">
                Kategori
              </th>
              <th className="text-left p-3 font-medium text-foreground">
                Harga
              </th>
              <th className="text-left p-3 font-medium text-foreground">
                Durasi
              </th>
              <th className="text-left p-3 font-medium text-foreground">
                Status
              </th>
              <th className="text-left p-3 font-medium text-foreground">
                Dibuat
              </th>
              <th className="text-right p-3 font-medium text-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={setSelected ? 8 : 7}
                  className="p-8 text-center text-muted-foreground text-body"
                >
                  Tidak ada layanan
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-muted/50">
                  {setSelected && (
                    <td className="p-3">
                      <Checkbox
                        checked={selected.includes(product.id)}
                        onCheckedChange={(checked) =>
                          handleSelect(product.id, !!checked)
                        }
                      />
                    </td>
                  )}
                  <td className="p-3">
                    <div className="font-medium text-foreground">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-caption text-muted-foreground truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="border-border">
                      {CATEGORY_LABELS[product.category]}
                    </Badge>
                  </td>
                  <td className="p-3 font-medium text-foreground">
                    {formatCurrency(parseFloat(product.price))}
                  </td>
                  <td className="p-3 text-foreground">
                    {product.duration} hari
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className={
                        product.isActive
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/service/${product.id}`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleStatus(product.id, product.isActive)
                          }
                        >
                          {product.isActive ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Nonaktifkan
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Aktifkan
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              productId: product.id,
                              productName: product.name,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Layanan</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin hapus "{deleteDialog.productName}"? Gak bisa balik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
