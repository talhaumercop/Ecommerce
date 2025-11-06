import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Category } from "@prisma/client";

export async function GET(
  _req: Request,
  context: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await context.params;

    const upperCategory = category.toUpperCase() as Category;

    const validCategories = Object.values(Category);
    if (!validCategories.includes(upperCategory)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const products = await db.product.findMany({
      where: { category: upperCategory },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
