'use client';

import { useState } from 'react';
import Navbar from '@/components/shop/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Package, Truck, CheckCircle2, Search, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function TrackPage() {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId || orderId.length < 10) {
            toast.error('Please enter a valid Order ID');
            return;
        }

        setLoading(true);
        setOrder(null);
        try {
            const res = await fetch(`/api/orders/track/${orderId}`);
            const data = await res.json();
            if (res.ok) {
                setOrder(data);
            } else {
                toast.error(data.message || 'Order not found');
            }
        } catch (error) {
            toast.error('Failed to track order');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 'pending', label: 'Order Placed', icon: Package },
        { id: 'processing', label: 'Processing', icon: Loader2 },
        { id: 'shipped', label: 'In Transit', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle2 }
    ];

    const currentStepIndex = order ? steps.findIndex(s => s.id === order.status) : -1;

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-black">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-24">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Track Your Order</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Enter your order ID from your confirmation email to see real-time delivery status.
                    </p>
                </div>

                <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-gray-900 mb-12">
                    <CardContent className="p-8">
                        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Enter Order ID (e.g. 658...)"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="h-16 pl-12 rounded-2xl bg-gray-50 dark:bg-black/50 border-none font-bold text-lg"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-16 px-10 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:scale-105 transition-transform"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Track Now'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <AnimatePresence mode="wait">
                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Visual Progress Bar */}
                            <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl">
                                <div className="flex justify-between relative mb-12">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 -z-0"></div>
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-black dark:bg-white -translate-y-1/2 transition-all duration-1000 -z-0"
                                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                    ></div>

                                    {steps.map((step, idx) => {
                                        const Icon = step.icon;
                                        const isActive = idx <= currentStepIndex;
                                        return (
                                            <div key={idx} className="relative z-10 flex flex-col items-center gap-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive
                                                        ? 'bg-black dark:bg-white text-white dark:text-black scale-110 shadow-xl'
                                                        : 'bg-white dark:bg-gray-800 text-gray-300 border border-gray-100 dark:border-gray-700'
                                                    }`}>
                                                    <Icon className={`w-6 h-6 ${idx === 1 && isActive ? 'animate-spin' : ''}`} />
                                                </div>
                                                <span className={`text-[10px] uppercase font-black tracking-widest ${isActive ? 'text-black dark:text-white' : 'text-gray-300'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Est. Delivery</p>
                                            <p className="font-black text-lg">
                                                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Destination</p>
                                            <p className="font-black text-lg">{order.shippingTo}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-black text-white p-8 rounded-[2rem] shadow-xl">
                                    <p className="text-gray-400 text-[10px] uppercase font-black mb-2">Order Status</p>
                                    <p className="text-2xl font-black capitalize">{order.status}</p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl md:col-span-2 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-widest">Order Amount</p>
                                        <p className="text-2xl font-black">₹{order.total.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-widest">Created On</p>
                                        <p className="font-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tracking Help */}
                {!order && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-20 flex flex-col items-center gap-8 grayscale opacity-30">
                        <img src="https://cdn-icons-png.flaticon.com/512/6124/6124991.png" className="w-32 h-32" alt="tracking" />
                        <p className="text-sm font-bold uppercase tracking-tighter">Your delivery journey starts with an ID</p>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
