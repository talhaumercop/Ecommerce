import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // <- await it, new syntax

    const formData = await request.formData();
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

    const updated = await db.product.update({
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
