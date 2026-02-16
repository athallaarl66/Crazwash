// app/api/admin/service/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as productService from "@/lib/productService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// ✅ PATCH /api/admin/products/[id] - UPDATE PRODUCT
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const product = await productService.updateProduct({
      id: productId,
      ...body,
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: "Layanan berhasil diperbarui",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 400 },
    );
  }
}

// ✅ DELETE /api/admin/products/[id] - SOFT DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    await productService.softDeleteProduct(productId);

    return NextResponse.json({
      success: true,
      message: "Layanan berhasil dihapus",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 400 },
    );
  }
}
