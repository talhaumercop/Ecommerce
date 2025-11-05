import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    const body = await req.json();
    const { cart, total, ...details } = body;

    const user = session?.user?.email
      ? await db.user.findUnique({ where: { email: session.user.email } })
      : null;

    const order = await db.order.create({
      data: {
        ...details,
        total: Math.round(total),
        userId: user?.id ?? null, // ✅ works for both guest + logged-in users
        items: {
          create: cart.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: Math.round(item.price),
          })),
        },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
