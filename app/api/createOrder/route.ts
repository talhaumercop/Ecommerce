import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { cart, total, status } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = await db.order.create({
  data: {
    userId: user.id,
    total,
    status: status === "PAID" ? "PAID" : "PENDING",
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    addressLine1: body.addressLine1,
    addressLine2: body.addressLine2,
    city: body.city,
    state: body.state,
    postalCode: body.postalCode,
    country: body.country,
    items: {
      create: cart.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  },
  include: { items: true },
});


    return NextResponse.json(order);
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
