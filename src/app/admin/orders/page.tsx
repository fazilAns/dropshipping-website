'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, Eye, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const statusMap: any = {
    pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
    processing: { label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
    shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
    delivered: { label: 'Delivered', icon: CheckCircle2, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
    cancelled: { label: 'Cancelled', icon: CheckCircle2, color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error('Error updating order');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-gray-500">Track and manage all customer orders.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold">No orders found</h2>
                    </div>
                ) : (
                    <div className="border rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Order Details</th>
                                    <th className="px-6 py-4 font-bold">Customer</th>
                                    <th className="px-6 py-4 font-bold">Items</th>
                                    <th className="px-6 py-4 font-bold">Total</th>
                                    <th className="px-6 py-4 font-bold">Payment</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                            <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{order.user?.name}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item: any, i: number) => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-100">
                                                        <img src={item.product?.images?.[0]} className="object-cover w-full h-full" alt="" />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-primary">₹{order.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 w-fit">
                                                    {order.paymentInfo?.method || 'Razorpay'}
                                                </span>
                                                {order.paymentInfo?.manualPaymentRef && (
                                                    <p className="text-[10px] text-gray-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-100 dark:border-blue-800">
                                                        Ref: <span className="font-mono">{order.paymentInfo.manualPaymentRef}</span>
                                                    </p>
                                                )}
                                                <Badge className={`text-[9px] w-fit ${order.paymentInfo?.status === 'paid' ? 'bg-green-100 text-green-700' : (order.paymentInfo?.status === 'verifying' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700')}`}>
                                                    {order.paymentInfo?.status?.toUpperCase() || 'UNKNOWN'}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${statusMap[order.status]?.color} border-none`}>
                                                {statusMap[order.status]?.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                                    disabled={updatingId === order._id}
                                                    className="text-xs bg-gray-50 dark:bg-gray-700 border rounded-md px-2 py-1 outline-none focus:ring-1 ring-primary"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
