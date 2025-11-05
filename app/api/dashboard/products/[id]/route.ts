import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";

// GET single product
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const product = await db.products.findUnique({ where: { id } });
    if (!product)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

// PATCH update product
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const isFeatured = formData.get("isFeatured") === "true";

    const file = formData.get("image") as File | null;
    let imageBase64: string | undefined;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      imageBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const updated = await db.products.update({
      where: { id },
      data: {
        name,
        description,
        price,
        isFeatured,
        ...(imageBase64 ? { image: imageBase64 } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// 🚨 ADD THIS: DELETE handler
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const existing = await db.products.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    await db.products.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}
