// app/api/admin/service/bulk-delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as productService from "@/lib/productService";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
