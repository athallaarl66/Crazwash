"use client";

import { useEffect, useState } from "react";
import { ProductCategory } from "@prisma/client";
import { api } from "@/lib/api-client";

/* =====================
   TYPES
===================== */
export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  category: ProductCategory;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  duration: string;
  category: ProductCategory;
  isActive: boolean;
};

/* =====================
   DEFAULT FORM
===================== */
const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  duration: "",
  category: ProductCategory.BASIC,
  isActive: true,
};

/* =====================
   HOOK
===================== */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);

  /* =====================
     FETCH
  ===================== */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await api.get<{ success: boolean; data: Product[] }>(
        "/api/admin/products",
      );

      if (result.success) {
        setProducts(result.data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (err: any) {
      console.error("Failed to fetch products:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =====================
     CREATE
  ===================== */
  const addProduct = async () => {
    if (!formData.name || !formData.price || !formData.duration) return false;

    try {
      const result = await api.post<{ success: boolean; data: Product }>(
        "/api/admin/products",
        formData,
      );

      if (result.success) {
        await fetchProducts();
        setFormData(emptyForm);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to create product:", err);
      return false;
    }
  };

  /* =====================
     UPDATE
  ===================== */
  const updateProduct = async (id: number) => {
    if (!formData.name || !formData.price || !formData.duration) return false;

    try {
      const result = await api.patch<{ success: boolean; data: Product }>(
        `/api/admin/products/${id}`,
        formData,
      );

      if (result.success) {
        await fetchProducts();
        resetForm();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update product:", err);
      return false;
    }
  };

  /* =====================
     DELETE
  ===================== */
  const deleteProduct = async (id: number) => {
    try {
      const result = await api.delete<{ success: boolean }>(
        `/api/admin/products/${id}`,
      );

      if (result.success) {
        await fetchProducts();
        setSelectedProduct(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete product:", err);
      return false;
    }
  };

  /* =====================
     TOGGLE ACTIVE
  ===================== */
  const toggleActive = async (product: Product) => {
    try {
      const result = await api.patch<{ success: boolean; data: Product }>(
        `/api/admin/products/${product.id}`,
        { isActive: !product.isActive },
      );

      if (result.success) {
        await fetchProducts();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to toggle product status:", err);
      return false;
    }
  };

  /* =====================
     EDIT MODE
  ===================== */
  const setEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      duration: String(product.duration),
      category: product.category,
      isActive: product.isActive,
    });
  };

  /* =====================
     RESET
  ===================== */
  const resetForm = () => {
    setFormData(emptyForm);
    setSelectedProduct(null);
  };

  /* =====================
     EXPORT
  ===================== */
  return {
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
  };
}
