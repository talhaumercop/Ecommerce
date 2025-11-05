'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { useSession } from 'next-auth/react'
import { toast } from "sonner";
import Navbar from '@/components/Navbar'
import NavbarTwo from '@/components/NavbarTwo'

type Product = {
  id?: string
  name?: string
  price?: number
  description?: string
  image?: string
}

type Review = {
  id: string
  userId: string
  productId: string
  rating: number
  comment?: string
  user?: { name?: string; image?: string }
  createdAt?: string
}

const Page = () => {
  const params = useParams()
  const id = params?.id as string | undefined
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
const [open, setOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/getProduct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setProduct(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/review?productId=${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.ok) {
          setReviews(Array.isArray(data) ? data : [])
        } else {
          console.error('Failed to fetch reviews:', data.error)
          setReviews([])
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setReviews([])
      }
    }

    const fetchAverageOfReview=async()=>{
      fetch(`/api/review/average/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAverage(data.average || 0);
        setTotal(data.totalReviews || 0);
      })
    }

    fetchProduct()
    fetchAverageOfReview()
    fetchReviews()
  }, [id])

  const { data: session } = useSession()

 const handleReviewSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!session?.user?.email) return alert("Please login first");

  try {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: id,
        rating,
        comment,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // show server error message
      alert(data?.error ?? "Failed to submit review");
      return;
    }

    // prepend new review to UI
    setReviews(prev => [data, ...prev]);
    setRating(0);
    setComment("");
  } catch (err) {
    console.error("Failed to submit review:", err);
    alert("Failed to submit review");
  }
};
useEffect(() => {
  if (!id) return;
  fetch(`/api/reviews?productId=${encodeURIComponent(id)}`)
    .then(r => r.json())
    .then(d => {
      if (Array.isArray(d)) setReviews(d);
      else {
        console.error("unexpected reviews response:", d);
        setReviews([]);
      }
    })
    .catch(err => {
      console.error("fetch reviews err", err);
      setReviews([]);
    });
}, [id]);


  if (!id) return <div>No product id provided</div>
  if (loading) return(
    <div className="w-full h-[100vh] flex flex-col items-center justify-center gap-6">
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 border-4 border-red-600 animate-spin rounded-full"></div>
    <div className="absolute inset-2 border-4 border-red-900 animate-ping rounded-full"></div>
  </div>
  <span className="text-red-500 tracking-widest uppercase animate-pulse">
    Loading Vault…
  </span>
</div>

  )
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found</div>

  const formattedPrice =
    typeof product.price === 'number'
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)
      : product.price ?? 'N/A'

return (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 mt-20 ">
<NavbarTwo/>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

      {/* IMAGE */}
      <div className="w-full">
        {product.image ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-[9/14] md:aspect-[9/16] object-cover border rounded-lg cursor-pointer"
              onClick={() => setOpen(true)}
            />

            {/* FULLSCREEN PREVIEW */}
            {open && (
              <div
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            )}
          </>
        ) : (
          <div className="w-full aspect-[9/16] flex items-center justify-center border rounded-lg text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-4 md:gap-6">

        <h1 className="text-2xl sm:text-3xl font-medium tracking-wide leading-tight">
          {product.name}
        </h1>

        <p className="text-lg sm:text-xl font-semibold">Rs. {product.price}</p>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {product.description}
        </p>

        <button
          onClick={() => {
  addToCart({
    id: product.id!,
    name: product.name!,
    price: product.price!,
    image: product.image!,
  });

  toast.success("Added to Bag", {
    description: `${product.name} is now in your cart.`,
  });
}}

          className="bg-black text-white px-6 py-3 sm:py-3 sm:px-8 rounded-none text-sm uppercase tracking-wide hover:bg-black/80 transition"
        >
          Add to Bag
        </button>

        {/* Rating */}
        <div className="flex items-center gap-1 sm:gap-2 pt-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="text-lg sm:text-xl">
              {average >= n ? "⭐" : "☆"}
            </span>
          ))}
          <span className="text-xs sm:text-sm text-gray-500">
            {average.toFixed(1)} ({total} reviews)
          </span>
        </div>

        {/* REVIEWS */}
        <div className="pt-6 border-t mt-4">
          <h2 className="text-lg font-medium mb-4">Reviews</h2>

          {/* Review Form */}
          <div className="p-4 border rounded-md mb-6">
            <h3 className="text-sm font-medium mb-2">Write a Review</h3>

            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-xl ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
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
              onClick={handleReviewSubmit}
              className="bg-black text-white px-4 py-2 text-sm uppercase hover:bg-black/80 transition"
            >
              Submit
            </button>
          </div>

          {/* Review List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border p-4 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{r.user?.name || "Anonymous"}</span>
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
)


}

export default Page
