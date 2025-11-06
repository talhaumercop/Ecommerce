'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ThankYouPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1b1b1b] to-[#3a0f12] text-white px-6">
      {/* Animated check icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="mb-6"
      >
        <CheckCircle2 className="w-20 h-20 text-green-500" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-2 text-center"
      >
        Thank You for Your Order!
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-300 mb-8 text-center max-w-md"
      >
        Your order has been successfully placed. We’ll notify you once it’s shipped.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          size="lg"
          onClick={() => router.push('/order')}
          className="bg-[#8B0000] hover:bg-[#a81a1a] text-white rounded-full px-8 py-6 text-lg"
        >
          View My Orders
        </Button>
      </motion.div>
    </div>
  )
}
