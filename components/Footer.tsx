"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-red-950 text-white border-black/10 mt-20 py-14 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold tracking-[0.25em] uppercase">
            ThreadHeist
          </h2>
          <p className="text-sm text-gray-600 mt-3">
            Redefining streetwear with bold energy and timeless expression.
          </p>
        </div>

        {/* LINKS */}
        <div className="text-sm uppercase tracking-wider space-y-3">
          <Link href="/featured" className="block hover:text-red-600 transition">Featured</Link>
          <Link href="/collection" className="block hover:text-red-600 transition">Collection</Link>
          <Link href="/cart" className="block hover:text-red-600 transition">Bag</Link>
        </div>
        <div >
<h1 className="text-4xl font-stretch-extra-expanded italic">
YOUR TRUST OUR PIRORITY
</h1>
        </div>
        {/* {/* NEWSLETTER
        <div>
          <p className="text-sm uppercase tracking-wider mb-3">Stay Updated</p>
          <div className="flex border-b border-black/30 pb-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 outline-none text-sm"
            />
            <button className="uppercase text-sm font-medium hover:text-red-600 transition">
              Join
            </button>
          </div>
        </div> */}
      </div> 

      {/* BOTTOM LINE */}
      <div className="text-center text-xs text-gray-500 mt-12 tracking-widest uppercase">
        © {new Date().getFullYear()} ThreadHeist. All Rights Reserved.
      </div>
    </footer>
  );
}
