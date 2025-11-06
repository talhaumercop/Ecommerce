import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await context.params; // ✅ await here

    const validCategories = ["WATCH", "PANTS", "SHIRTS", "JACKETS", "DEAL"];
    const upperCategory = category.toUpperCase();

    if (!validCategories.includes(upperCategory)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const products = await db.product.findMany({
      where: { category: upperCategory },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
    console.log(products)
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
