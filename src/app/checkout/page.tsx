'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/components/providers/CartProvider';
import Navbar from '@/components/shop/Navbar';
import { toast } from 'sonner';
import { CreditCard, Globe, Loader2, ShieldCheck, Smartphone, Truck, ChevronLeft, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
    interface Window {
        Razorpay: any;
    }
}

function CheckoutContent() {
    const { data: session, status } = useSession();
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();

    const buyNowProductId = searchParams.get('productId');
    const buyNowQuantity = parseInt(searchParams.get('quantity') || '1');

    const [loading, setLoading] = useState(false);
    const [buyNowProduct, setBuyNowProduct] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'global'>('razorpay');
    const [transactionId, setTransactionId] = useState('');
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/checkout');
        }
        if (!buyNowProductId && cart.length === 0 && status !== 'loading') {
            router.push('/cart');
        }
        if (buyNowProductId) {
            fetch(`/api/products/${buyNowProductId}`)
                .then(res => res.json())
                .then(data => setBuyNowProduct(data))
                .catch(err => console.error('Error fetching buy now product:', err));
        }
    }, [status, cart, router, buyNowProductId]);

    const displayItems = buyNowProductId && buyNowProduct ? [{
        _id: buyNowProduct._id,
        name: buyNowProduct.name,
        price: buyNowProduct.price,
        quantity: buyNowQuantity,
        image: buyNowProduct.images?.[0]
    }] : cart;

    const displayTotal = buyNowProductId && buyNowProduct
        ? (buyNowProduct.price * buyNowQuantity)
        : cartTotal;

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleManualPayment = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: displayItems,
                    totalAmount: displayTotal,
                    shippingAddress: address,
                    paymentMethod: paymentMethod === 'upi' ? 'UPI (GPay/Paytm)' : 'Global Card/Manual',
                    transactionId: transactionId || 'PENDING_USER_ACTION'
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Order placed! Your tracking ID will be available shortly.');
                if (!buyNowProductId) clearCart();
                router.push('/orders');
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!address.street || !address.city || !address.state || !address.postalCode) {
            toast.error('Please fill in all shipping details');
            return;
        }

        if (paymentMethod !== 'razorpay') {
            return handleManualPayment();
        }

        setLoading(true);
        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Payment gateway error. Please try again.');
                setLoading(false);
                return;
            }

            const orderRes = await fetch('/api/orders/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: displayTotal,
                    productId: buyNowProductId,
                    quantity: buyNowQuantity
                }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Dropship Elite',
                description: 'Premium Store Purchase',
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch('/api/orders/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                items: displayItems,
                                totalAmount: displayTotal,
                                shippingAddress: address,
                            }),
                        });
                        if (verifyRes.ok) {
                            toast.success('Payment successful!');
                            if (!buyNowProductId) clearCart();
                            router.push(`/orders`);
                        } else {
                            throw new Error('Verification failed');
                        }
                    } catch (err: any) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: session?.user?.name,
                    email: session?.user?.email,
                },
                theme: { color: '#2563eb' },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast.error(error.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') return (
        <div className="flex h-screen bg-slate-950 items-center justify-center">
            <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Forms */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-10"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Secure <span className="text-blue-500">Checkout</span></h1>
                                <p className="text-gray-400 font-medium">Complete your premium order safely.</p>
                            </div>
                        </div>

                        {/* Glass Container */}
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <div className="p-8 md:p-12 space-y-10">

                                {/* Shipping Section */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-black uppercase tracking-widest italic">Shipping Destination</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Street Address</Label>
                                            <Input
                                                name="street"
                                                value={address.street}
                                                onChange={handleAddressChange}
                                                placeholder="Enter your street address"
                                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">City</Label>
                                            <Input
                                                name="city"
                                                value={address.city}
                                                onChange={handleAddressChange}
                                                placeholder="City"
                                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">State</Label>
                                            <Input
                                                name="state"
                                                value={address.state}
                                                onChange={handleAddressChange}
                                                placeholder="State"
                                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Postal Code</Label>
                                            <Input
                                                name="postalCode"
                                                value={address.postalCode}
                                                onChange={handleAddressChange}
                                                placeholder="PIN Code"
                                                maxLength={6}
                                                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 ml-1">Country</Label>
                                            <Input
                                                value={address.country}
                                                disabled
                                                className="h-14 bg-white/10 border-white/10 rounded-2xl text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Divider */}
                                <div className="h-px bg-white/5"></div>

                                {/* Payment Section */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-xl font-black uppercase tracking-widest italic">Payment Method</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Card Option */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setPaymentMethod('razorpay')}
                                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${paymentMethod === 'razorpay'
                                                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                                                : 'border-white/5 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="relative z-10 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'razorpay' ? 'text-blue-500' : 'text-gray-400'}`} />
                                                    <div className="flex gap-1">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" className="h-2 opacity-50" alt="Visa" />
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-3 opacity-50" alt="MC" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm uppercase tracking-wider">Credit / Debit</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Automated & Safe</p>
                                                </div>
                                            </div>
                                            {paymentMethod === 'razorpay' && <motion.div layoutId="glow" className="absolute inset-0 bg-blue-500/20 blur-2xl -z-0" />}
                                        </motion.div>

                                        {/* UPI Option */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${paymentMethod === 'upi'
                                                ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_30px_rgba(249,115,22,0.2)]'
                                                : 'border-white/5 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="relative z-10 space-y-4">
                                                <Smartphone className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-orange-500' : 'text-gray-400'}`} />
                                                <div>
                                                    <p className="font-black text-sm uppercase tracking-wider">UPI / QR</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">GPay • Paytm • PhonePe</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Global Option */}
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setPaymentMethod('global')}
                                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${paymentMethod === 'global'
                                                ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                                                : 'border-white/5 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="relative z-10 space-y-4">
                                                <Globe className={`w-6 h-6 ${paymentMethod === 'global' ? 'text-emerald-500' : 'text-gray-400'}`} />
                                                <div>
                                                    <p className="font-black text-sm uppercase tracking-wider">International</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">PayPal • Stripe</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Manual Help UI */}
                                    <AnimatePresence>
                                        {paymentMethod !== 'razorpay' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-8 space-y-6"
                                            >
                                                <div className="space-y-3">
                                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Step 1: Make Payment</p>
                                                    <div className="p-4 bg-black/40 rounded-2xl inline-block border border-white/5">
                                                        {paymentMethod === 'upi' ? (
                                                            <p className="font-black text-lg italic tracking-tight">Send ₹{displayTotal.toLocaleString()} to <span className="text-orange-500 underline">your-upi@okaxis</span></p>
                                                        ) : (
                                                            <p className="font-black text-lg italic tracking-tight">Send ${(displayTotal / 80).toFixed(2)} to <span className="text-emerald-500 underline">payments@store.com</span></p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Step 2: Reference Code (Optional)</label>
                                                    <Input
                                                        placeholder="Paste your transaction ID here"
                                                        value={transactionId}
                                                        onChange={(e) => setTransactionId(e.target.value)}
                                                        className="h-14 bg-black/50 border-white/10 rounded-2xl"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 flex-shrink-0">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black uppercase italic tracking-tighter">Bank-Level Security</p>
                                <p className="text-sm text-gray-400">Your details are protected with 256-bit SSL encryption. We never store your card data.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Summary & Image */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-10 lg:sticky lg:top-32">

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl p-10 space-y-10"
                        >
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Purchase <span className="text-gray-400">Summary</span></h2>

                            {/* Items List */}
                            <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {displayItems.map((item: any) => (
                                    <div key={item._id} className="flex justify-between items-center group">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div>
                                                <p className="font-black uppercase italic tracking-tighter text-sm line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-5 pt-8 border-t border-white/5">
                                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{displayTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">Free of Cost</span>
                                </div>
                                <div className="pt-4 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-blue-500 tracking-[0.3em] mb-1">Total Payment</p>
                                        <h3 className="text-5xl font-black italic tracking-tighter">₹{displayTotal.toLocaleString()}</h3>
                                    </div>
                                    <ShieldCheck className="w-8 h-8 text-emerald-500 opacity-50" />
                                </div>
                            </div>

                            {/* Premium CTA Button */}
                            <Button
                                onClick={handlePayment}
                                disabled={loading || (!!buyNowProductId && !buyNowProduct)}
                                className="w-full h-20 rounded-[2rem] bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-xl font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Processing Order
                                    </div>
                                ) : (
                                    `Complete Purchase`
                                )}
                            </Button>
                        </motion.div>

                        {/* Premium Side Image Concept (Hidden on mobile/tablet) */}
                        <div className="hidden xl:block relative group rounded-[3rem] overflow-hidden aspect-[4/3] shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop"
                                className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                                alt="Secure Payment"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-2xl font-black italic uppercase tracking-tighter">World Class Security</p>
                                <p className="text-gray-300 text-sm font-medium">Join 50,000+ happy customers shopping global brands with confidence.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen bg-slate-950 items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}


