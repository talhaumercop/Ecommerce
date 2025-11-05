'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [pendingStatus, setPendingStatus] = useState<{ orderId: string; newStatus: string } | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 5

  const isAdmin = (session?.user as any)?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    if (!isAdmin || status !== 'authenticated') return

    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/adminOrders?page=${page}&limit=${limit}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setOrders(data.orders)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error(err)
        toast.error('Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [page, status, isAdmin])

  const handleConfirmStatusChange = async () => {
    if (!pendingStatus) return
    const { orderId, newStatus } = pendingStatus
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrders(prev => prev.map(o => (o.id === orderId ? data : o)))
      toast.success('Order Updated', { description: `Status changed to ${newStatus}` })
    } catch (err) {
      console.error(err)
      toast.error('Update Failed', { description: 'Could not update order status' })
    } finally {
      setUpdating(null)
      setPendingStatus(null)
    }
  }

  const handleDownload = () => {
    if (!orders.length) {
      toast.error('No orders to download')
      return
    }

    const csvHeaders = [
      'Order ID',
      'User Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'State',
      'Postal Code',
      'Country',
      'Total',
      'Status',
      'Created At',
    ]

    const csvRows = orders.map(order => {
      const address = `${order.addressLine1} ${order.addressLine2 ?? ''}`.trim()
      return [
        order.id,
        order.fullName,
        order.email,
        order.phone,
        address,
        order.city,
        order.state ?? '',
        order.postalCode,
        order.country,
        order.total,
        order.status,
        new Date(order.createdAt).toLocaleString(),
      ].join(',')
    })

    const csvData = [csvHeaders.join(','), ...csvRows].join('\n')
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `orders_page_${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isAdmin) return <p>Access Denied.</p>
  if (loading) return <p>Loading...</p>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Orders</h1>
        <Button onClick={handleDownload}>Download CSV</Button>
      </div>

      <div className="grid gap-4">
        {orders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
              <p className="text-sm text-gray-500">{order.user?.name ?? order.user?.email}</p>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-2">
                <p>
                  <span className="font-semibold">Name:</span> {order.fullName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {order.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {order.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {order.addressLine1} {order.addressLine2}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {order.city}, {order.state} {order.postalCode}
                </p>
                <p>
                  <span className="font-semibold">Country:</span> {order.country}
                </p>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Status: {order.status}</span>

                <Select
                  onValueChange={val => setPendingStatus({ orderId: order.id, newStatus: val })}
                  disabled={updating === order.id}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
                      .filter(s => s !== order.status)
                      .map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <ul className="text-sm text-gray-700 mb-2">
                {order.items.map((item: any) => (
                  <li key={item.id}>
                    {item.product?.name} × {item.quantity} — ${item.price}
                  </li>
                ))}
              </ul>
              <div className="font-semibold">Total: ${order.total}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-2">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next
        </Button>
      </div>

      <AlertDialog open={!!pendingStatus} onOpenChange={() => setPendingStatus(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this order’s status to{' '}
              <span className="font-semibold text-blue-600">{pendingStatus?.newStatus}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStatus(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
