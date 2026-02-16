// app/api/service_get/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as productService from "@/lib/productService";

export async function GET(req: NextRequest) {
  try {
    const products = await productService.getActiveProducts();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("GET Public Products Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 },
    );
  }
}
