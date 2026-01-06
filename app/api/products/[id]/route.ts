// app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// UPDATE PRODUCT
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    const body = await req.json();

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        stock: Number(body.stock),
        duration: Number(body.duration),
        category: body.category,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    // 🔒 cek apakah sudah pernah diorder
    const ordersCount = await prisma.orderItem.count({
      where: {
        productId: productId, // ✅ SEKARANG VALID
      },
    });

    if (ordersCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete product that has been ordered. Set inactive instead.",
        },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
