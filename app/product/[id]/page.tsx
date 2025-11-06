'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import NavbarTwo from "@/components/NavbarTwo";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id?: string;
  name?: string;
  price?: number;
  description?: string;
  images?: { url: string }[];
};

type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  user?: { name?: string; image?: string };
  createdAt?: string;
};

export default function Page() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addToCart = useCartStore((state) => state.addToCart);
  const { data: session } = useSession();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/getProduct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAverage = async () => {
      const res = await fetch(`/api/review/average/${id}`);
      const data = await res.json();
      setAverage(data.average || 0);
      setTotal(data.totalReviews || 0);
    };

    const fetchReviews = async () => {
      const res = await fetch(`/api/review?productId=${id}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    };

    fetchProduct();
    fetchAverage();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return alert("Please login first");

    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, rating, comment }),
    });
    const data = await res.json();

    if (!res.ok) return alert(data.error ?? "Failed to submit review");

    setReviews((prev) => [data, ...prev]);
    setRating(0);
    setComment("");
  };

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        Loading Vault…
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const images = product.images ?? [];
  const mainImage = images[currentImageIndex]?.url || "/placeholder.jpg";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 mt-20">
      <NavbarTwo />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* IMAGE SECTION */}
        <div className="w-full">
          {/* Smooth Transition Image */}
          <div
            className="relative w-full aspect-[9/14] md:aspect-[9/16] overflow-hidden border rounded-lg cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={mainImage}
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`thumb-${i}`}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer transition ${
                    i === currentImageIndex
                      ? "border-black"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          )}

          {/* FULLSCREEN PREVIEW */}
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer p-4"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold tracking-wide">{product.name}</h1>
          <p className="text-lg font-semibold">Rs. {product.price}</p>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <button
            onClick={() => {
              addToCart({
                id: product.id!,
                name: product.name!,
                price: product.price!,
                image: mainImage,
              });
              toast.success("Added to Bag", {
                description: `${product.name} is now in your cart.`,
              });
            }}
            className="bg-black text-white px-8 py-3 text-sm uppercase tracking-wide hover:bg-black/80 transition"
          >
            Add to Bag
          </button>

          {/* Ratings */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n}>{average >= n ? "⭐" : "☆"}</span>
            ))}
            <span className="text-sm text-gray-500">
              {average.toFixed(1)} ({total} reviews)
            </span>
          </div>

          {/* Reviews */}
          <div className="pt-6 border-t mt-4">
            <h2 className="text-lg font-medium mb-4">Reviews</h2>

            {/* Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="p-4 border rounded-md mb-6"
            >
              <h3 className="text-sm font-medium mb-2">Write a Review</h3>
              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 text-sm rounded mb-3"
                placeholder="Write your review..."
              />

              <button
                type="submit"
                className="bg-black text-white px-4 py-2 text-sm uppercase hover:bg-black/80 transition"
              >
                Submit
              </button>
            </form>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border p-4 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {r.user?.name || "Anonymous"}
                      </span>
                      <span className="text-yellow-500 text-sm">
                        {"★".repeat(r.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(r.createdAt ?? "").toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
