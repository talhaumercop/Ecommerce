"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isFeatured: boolean;
  image?: string;
  createdAt?: string;
}

export default function HomeProductsSection() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [productsRes, ratingsRes] = await Promise.all([
        fetch("/api/getAllProducts"),
        fetch("/api/review/average/all"),
      ]);

      const [productsData, ratingsData] = await Promise.all([
        productsRes.json(),
        ratingsRes.json(),
      ]);

      const rmap: Record<string, number> = {};
      ratingsData.forEach((r: any) => (rmap[r.productId] = r._avg.rating || 0));

      setProducts(productsData);
      setRatings(rmap);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
   <div className="w-full h-[100vh] flex flex-col items-center justify-center gap-6">
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 border-4 border-red-600 animate-spin rounded-full"></div>
    <div className="absolute inset-2 border-4 border-red-900 animate-ping rounded-full"></div>
  </div>
  <span className="text-red-500 tracking-widest uppercase animate-pulse">
    Loading Vault…
  </span>
</div>


    );
  }

  const featured = products.filter((p) => p.isFeatured);
  const others = products.filter((p) => !p.isFeatured);

  return (
    <section className="text-black w-full px-6 lg:px-12 pt-24 pb-32">

      {/* HEADER */}
      <div className="flex justify-center items-center mb-16">
<h1 className="text-3xl md:text-4xl uppercase underline tracking-wider inline-block pb-1">
  HOT DEAL
</h1>



        <button
          onClick={() => router.push("/products")}
          className="hover:text-red-500 tracking-widest transition"
        >
          VIEW ALL →
        </button>
      </div>

      {/* FEATURED GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-28">
        {featured.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/product/${product.id}`)}
            className="cursor-pointer group border  transition-all shadow-xl"
          >
            <div className="relative w-full h-[50vh]">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-all"
                />
              )}
            </div>

            <div className="border-t px-4 py-3 text-xs uppercase tracking-wider flex justify-between">
              <span>{product.name}</span>
              <span>{product.price} $</span>
            </div>
          </div>
        ))}
      </div>

      {/* OTHER SECTION */}
      <div className="flex justify-center items-center mb-12">
        <h1 className="text-3xl md:text-4xl uppercase tracking-wider">
          Rest Of The Vault
        </h1>
      </div>

      {/* OTHER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {others.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/product/${product.id}`)}
            className="cursor-pointer group border transition-all shadow-xl"
          >
            <div className="relative w-full h-[50vh]">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-all"
                />
              )}
            </div>
            <div className="border-t px-4 py-3 text-xs uppercase tracking-wider flex justify-between">
              <span>{product.name}</span>
              <span>{product.price} $</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
