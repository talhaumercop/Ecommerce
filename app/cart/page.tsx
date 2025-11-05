"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "sonner";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  );

  if (cart.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 mt-20">
        <h2 className="text-2xl tracking-wide uppercase">Your bag is empty</h2>
        <Link
          href="/collection"
          className="mt-4 underline text-sm hover:text-red-600 transition"
        >
          Continue shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-2xl sm:text-3xl uppercase tracking-wider mb-12 text-center">
        Your Bag
      </h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b pb-6"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-32 object-cover border cursor-pointer"
            />

            <div className="flex-1">
              <h3 className="uppercase tracking-wide text-sm sm:text-base">
                {item.name}
              </h3>

              <p className="text-xs sm:text-sm text-gray-500">
                Qty: {item.quantity ?? 1}
              </p>

              <p className="text-sm sm:text-base mt-1">
                ${(item.price * (item.quantity ?? 1)).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => {
                removeFromCart(item.id);
                toast.success("Removed from Bag", {
                  description: `${item.name} removed`,
                });
              }}
              className="text-xs underline hover:text-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* TOTAL + ACTIONS */}
      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="uppercase tracking-wide text-lg sm:text-xl">
          Total: <span className="font-medium">${total.toFixed(2)}</span>
        </h3>

        <div className="flex gap-4">
          <button
            onClick={() => {
              clearCart();
              toast.error("Bag Cleared");
            }}
            className="text-sm uppercase underline hover:text-red-600 transition"
          >
            Clear Bag
          </button>

          <Link
            href={`/checkoutPage?price=${total}`}
            className="bg-black text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-black/80 transition"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
