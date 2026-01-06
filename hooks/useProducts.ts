// hooks/useProducts
"use client";

import { useEffect, useState } from "react";
import { Category } from "@prisma/client";

/* =====================
   TYPES
===================== */
export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: string; // Prisma Decimal -> string
  stock: number;
  category: Category;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  duration: string;
  category: Category;
  isActive: boolean;
};

/* =====================
   DEFAULT FORM
===================== */
const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  duration: "",
  category: Category.BASIC,
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
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
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

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) return false;

    await fetchProducts();
    setFormData(emptyForm);
    return true;
  };

  /* =====================
     UPDATE
  ===================== */
  const updateProduct = async (id: number) => {
    if (!formData.name || !formData.price || !formData.duration) return false;

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) return false;

    await fetchProducts();
    resetForm();
    return true;
  };

  /* =====================
     DELETE
  ===================== */
  const deleteProduct = async (id: number) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return false;

    await fetchProducts();
    setSelectedProduct(null);
    return true;
  };

  /* =====================
     TOGGLE ACTIVE ✅ FIX ERROR
  ===================== */
  const toggleActive = async (product: Product) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        description: product.description ?? "",
        price: product.price,
        stock: String(product.stock),
        duration: String(product.duration),
        category: product.category,
        isActive: !product.isActive,
      }),
    });

    if (!res.ok) return false;

    await fetchProducts();
    return true;
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
      stock: String(product.stock),
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
    toggleActive, // ✅ FIXED
    setEditProduct,
    resetForm,
  };
}
