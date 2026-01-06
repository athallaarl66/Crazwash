"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useProducts, Product } from "@/hooks/useProducts";

import { ProductStats } from "./components/ProductStats";
import { ProductFilters } from "./components/ProductFilters";
import { ProductTable } from "./components/ProductTable";
import { ProductFormDialog } from "./components/ProductFormDialog";
import { DeleteDialog } from "./components/DeleteDialog";

export default function InventoryPage() {
  const {
    products,
    loading,
    selectedProduct,
    formData,
    setFormData,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
    setEditProduct,
    resetForm,
  } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  /* =====================
     FILTER LOGIC
  ===================== */
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) =>
        filterStatus === "active" ? p.isActive : !p.isActive
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, filterCategory, filterStatus]);

  /* =====================
     ACTIONS
  ===================== */
  const handleAdd = async () => {
    const success = await addProduct();
    if (success) setIsAddDialogOpen(false);
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;
    const success = await updateProduct(selectedProduct.id);
    if (success) setIsEditDialogOpen(false);
  };

  const handleDelete = async (): Promise<boolean> => {
    if (!selectedProduct) return false;
    return await deleteProduct(selectedProduct.id);
  };

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setEditProduct(product);
    setIsDeleteDialogOpen(true);
  };

  /* =====================
     LOADING STATE
  ===================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Manage your products and services</p>
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <ProductStats products={products} />

      {/* Filters */}
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        totalProducts={products.length}
        filteredCount={filteredProducts.length}
      />

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        onToggleActive={toggleActive}
      />

      {/* ADD */}
      <ProductFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAdd}
        onCancel={() => {
          setIsAddDialogOpen(false);
          resetForm();
        }}
      />

      {/* EDIT */}
      <ProductFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEdit}
        onCancel={() => {
          setIsEditDialogOpen(false);
          resetForm();
        }}
      />

      {/* DELETE */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        productName={selectedProduct?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          resetForm();
        }}
      />
    </div>
  );
}
