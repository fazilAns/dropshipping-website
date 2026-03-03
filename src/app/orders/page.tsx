'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/shop/Navbar';
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const statusMap: any = {
    pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-500/10 text-yellow-600' },
    processing: { label: 'Processing', icon: Loader2, color: 'bg-blue-500/10 text-blue-600' },
    shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-500/10 text-purple-600' },
    delivered: { label: 'Delivered', icon: CheckCircle2, color: 'bg-green-500/10 text-green-600' },
    cancelled: { label: 'Cancelled', icon: CheckCircle2, color: 'bg-red-500/10 text-red-600' },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders')
            .then((res) => res.json())
            .then((data) => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] dark:bg-black">
                <Navbar />
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-black dark:text-white" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-black">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-sm"
                        >
                            <div className="w-8 h-[2px] bg-primary"></div>
                            Dashboard
                        </motion.div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">My <br /><span className="text-gray-400">Orders</span></h1>
                    </div>
                    <Link href="/">
                        <Button className="h-14 px-8 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                            <ArrowLeft className="mr-2 w-5 h-5" /> Back to Shop
                        </Button>
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-gray-900 p-20 text-center">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-black/50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 grayscale opacity-20">
                            <Package className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">No Story Yet</h2>
                        <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">You haven't added any pieces to your collection. Start your journey with our latest drops.</p>
                        <Link href="/shop">
                            <Button className="h-16 px-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-lg hover:scale-105 transition-transform">
                                Explore Collection
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="space-y-10">
                        {orders.map((order: any) => {
                            const status = statusMap[order.status] || statusMap.pending;
                            const StatusIcon = status.icon;
                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-gray-900">
                                        <CardContent className="p-0">
                                            {/* Order Header */}
                                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-8">
                                                <div className="flex items-center gap-12">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2">Order Placed</p>
                                                        <p className="text-lg font-black">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2">Investment</p>
                                                        <p className="text-lg font-black tracking-tight">₹{order.totalAmount.toLocaleString()}</p>
                                                    </div>
                                                    <div className="hidden lg:block">
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-2">Reference</p>
                                                        <p className="text-base font-bold font-mono opacity-50">#{order._id.substring(order._id.length - 12).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${status.color} font-black uppercase tracking-widest text-xs`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    {status.label}
                                                </div>
                                            </div>

                                            {/* Items List */}
                                            <div className="p-8 space-y-8">
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex gap-8 items-center group">
                                                        <div className="relative w-24 h-24 rounded-3xl bg-gray-50 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-800 flex-shrink-0">
                                                            <img
                                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                                                alt={item.product?.name}
                                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <h4 className="font-black text-xl line-clamp-1 uppercase italic tracking-tighter">{item.product?.name || 'Deleted Product'}</h4>
                                                            <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
                                                                <span>Qty: {item.quantity}</span>
                                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                                <span>₹{item.price.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <Link href={item.product ? `/track` : '#'}>
                                                            <Button variant="ghost" className="h-14 px-6 rounded-2xl font-black uppercase tracking-widest text-xs border border-transparent hover:border-gray-200 dark:hover:border-gray-800">
                                                                Track
                                                                <ChevronRight className="ml-2 w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Action Bar */}
                                            <div className="p-6 bg-gray-50 dark:bg-black/20 flex justify-end">
                                                <Link href={`/track`}>
                                                    <Button className="h-12 px-8 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                                                        Order Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
