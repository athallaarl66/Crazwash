// app/api/admin/service/bulk-delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminGuardResponse } from "@/lib/api-error-handler";
import * as productService from "@/lib/productService";

export async function DELETE(req: NextRequest) {
  const denied = await adminGuardResponse();
  if (denied) return denied;

  try {
    const { ids } = await req.json();
    await productService.bulkSoftDeleteProducts(ids);

    return NextResponse.json({
      success: true,
      message: "Layanan berhasil dihapus",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to bulk delete products" },
      { status: 400 },
    );
  }
}
