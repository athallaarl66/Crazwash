// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, description, price, stock, category, duration, isActive } =
      body;

    // ✅ FIX VALIDATION (0 BOLEH)
    if (!name || price === undefined || duration === undefined || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: Number(price), // ✅ FIX
        stock: Number(stock ?? 0), // ✅ FIX (0 AMAN)
        category,
        duration: Number(duration), // ✅ FIX
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
