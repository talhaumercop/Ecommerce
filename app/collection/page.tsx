"use client";

import Navbar from "@/components/Navbar";
import NavbarTwo from "@/components/NavbarTwo";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "PANTS & BOTTOMS",
    image: "/pant.png",
    link: "/products/pants",
  },
  {
    id: 2,
    title: "SHIRT & TOPS",
    image: "/shirt.png",
    link: "/products/shirts",
  },
  {
    id: 3,
    title: "ACCESSORIES",
    image: "/watch.png",
    link: "/products/watch",
  },
  {
    id: 4,
    title: "DEAL OF THE DAY",
    image: "/deal.png",
    link: "/products/deal",
  },
];

export default function CategoriesSection() {
  return (
    <section className="w-full min-h-screen px-6 lg:px-16 py-24 bg-[#ffffff] text-white">
      <NavbarTwo/>
      <h1 className="text-center text-4xl md:text-5xl font-bold mb-20 tracking-[0.2em] text-red-900 uppercase">
        The Vault Categories
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="relative group overflow-hidden shadow-2xl cursor-pointer h-[90vh]"
          >
            <div className="absolute inset-0 transition-transform duration-[4000ms] ease-out group-hover:scale-110">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-widest mb-6">
                {cat.title}
              </h2>

              <Link
                href={cat.link}
                className="px-6 py-2 border border-red-600 text-red-500 font-semibold uppercase tracking-wider transition-all duration-500 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-lg"
              >
                Explore →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
