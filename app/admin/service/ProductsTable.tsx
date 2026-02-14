// app/admin/service/ProductsTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}

export default function ProductsTable({
  products,
  onRefresh,
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
      const response = await fetch(
        `/api/admin/service/${deleteDialog.productId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        if (onRefresh) onRefresh();
        setDeleteDialog({ open: false, productId: null, productName: "" });
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Gagal menghapus");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleToggleStatus = async (
    productId: number,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/admin/service/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        if (onRefresh) onRefresh();
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Gagal mengubah status");
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-medium">Nama Layanan</th>
              <th className="text-left p-3 font-medium">Kategori</th>
              <th className="text-left p-3 font-medium">Harga</th>
              <th className="text-left p-3 font-medium">Durasi</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Dibuat</th>
              <th className="text-right p-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Tidak ada layanan
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline">
                      {CATEGORY_LABELS[product.category]}
                    </Badge>
                  </td>
                  <td className="p-3 font-medium">
                    {formatCurrency(parseFloat(product.price))}
                  </td>
                  <td className="p-3">{product.duration} hari</td>
                  <td className="p-3">
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className={
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {product.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </td>
                  <td className="p-3 text-gray-500">
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
                          className="text-red-600"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Layanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus "{deleteDialog.productName}"?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
