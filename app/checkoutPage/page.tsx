"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCartStore } from "@/lib/store/cartStore"
import { useState } from "react"
import NavbarTwo from "@/components/NavbarTwo"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const price = parseFloat(searchParams.get("price") || "0")
  const { cart, clearCart } = useCartStore()

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.addressLine1) return alert("Fill all required fields")

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, total: price, cart }),
    })

    if (res.ok) {
      clearCart()
      router.push("/thank-you")
    } else {
      alert("Something went wrong")
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-20 px-4 text-black">
      <NavbarTwo/>
      <h1 className="text-3xl tracking-widest uppercase mb-8 text-center">Checkout</h1>

      <div className="space-y-4">
        {[
          "fullName",
          "email",
          "phone",
          "addressLine1",
          "addressLine2",
          "city",
          "state",
          "postalCode",
          "country"
        ].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            onChange={handleChange}
            className="w-full bg-gray-200 text-black border border-white/20 px-4 py-3 rounded-md outline-none focus:border-white transition"
          />
        ))}

        <div className="flex items-center justify-between border-t border-white/20 pt-6 mt-6">
          <p className="uppercase tracking-wider text-lg">
            Total: <span className="text-red-800 font-bold text-2xl">${price.toFixed(2)}</span>
          </p>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-red-900  text-white uppercase tracking-wider rounded-md hover:bg-red-800 hover:text-white transition"
          >
            Confirm Order
          </button>
        </div>
        <div>
          <p className="italic mt-10 text-gray-400 text-sm">
            "We currently only have pay on delivery available. Please ensure your
            address and contact details are correct."
          </p>
        </div>
      </div>
    </div>
  )
}
