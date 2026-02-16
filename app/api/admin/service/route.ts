// app/api/admin/service/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as productService from "@/lib/productService";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await productService.getAllProducts();
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("GET Admin Products Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// ✅ POST /api/admin/products - CREATE PRODUCT (ADMIN)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const product = await productService.createProduct(body);

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Layanan berhasil dibuat",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("❌ Create product API error:", error);

    // Handle duplicate name error
    if (error.message.includes("already exists") || error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Nama layanan sudah ada" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 400 },
    );
  }
}
