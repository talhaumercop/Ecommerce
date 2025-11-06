import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const product = await db.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const price = Number(formData.get("price"));
  const isFeatured = formData.get("isFeatured") === "true";
  const images = formData.getAll("images") as File[];

  await db.product.update({
    where: { id },
    // @ts-ignore
    data: { name, description, category, price, isFeatured },
  });

  for (const file of images) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    await db.productImage.create({
      data: { url: base64, productId: id },
    });
  }

  return NextResponse.json({ message: "Updated successfully" });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await db.product.delete({ where: { id } });

  return NextResponse.json({ message: "Product deleted" });
}
