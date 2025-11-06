import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // assuming Prisma client
import {Category} from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, isFeatured, category, images } = await req.json();

    if (
      typeof name !== 'string' ||
      typeof description !== 'string' ||
      typeof price !== 'number' ||
      typeof isFeatured !== 'boolean' ||
      !Array.isArray(images) ||
      !Object.values(Category).includes(category)
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Create product with nested image creation
    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        isFeatured,
        category,
        images: {
          create: images.map((url: string) => ({ url })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
