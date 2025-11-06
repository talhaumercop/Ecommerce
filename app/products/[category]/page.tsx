"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import NavbarTwo from "@/components/NavbarTwo";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isFeatured: boolean;
  images?: { url: string }[];
}

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams();
  const category = (params.category as string)?.toUpperCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products/${category}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const featured = products.filter((p) => p.isFeatured);
  const others = products.filter((p) => !p.isFeatured);

  return (
    <div className="min-h-screen w-full text-black px-8 py-26">
      <NavbarTwo />

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col justify-center items-center mb-12">
          <h1 className="text-5xl tracking-wide uppercase mb-6">
            {category} COLLECTION
          </h1>
        </div>

        {/* FEATURED PRODUCTS
        {featured.length > 0 && (
          <>
            <div className="flex justify-center items-center mb-12">
              <h1 className="text-3xl tracking-wide uppercase">
                Featured Products
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
              {featured.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="border-2 border-black cursor-pointer transition-all duration-300 group"
                >
                  <div className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
                    {product.images?.[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="border-t-2 border-black flex justify-between items-center px-4 py-3 text-xs tracking-wide uppercase">
                    <span>{product.name}</span>
                    <span>{product.price} Rs</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )} */}

        {/* OTHER PRODUCTS */}
        {/* <div className="flex justify-center items-center mb-12">
          <h1 className="text-3xl tracking-wide uppercase">Other Products</h1>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {others.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="border-2 border-black cursor-pointer transition-all duration-300 group"
            >
              <div className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="border-t-2 border-black flex justify-between items-center px-4 py-3 text-xs tracking-wide uppercase">
                <span>{product.name}</span>
                <span>{product.price} Rs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
