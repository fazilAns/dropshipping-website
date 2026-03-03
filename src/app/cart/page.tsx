'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shop/Navbar';
import { useCart } from '@/components/providers/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-black">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Your cart is empty</h1>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Looks like you hasn't added anything to your cart yet. Explore our products and find something you love!
                        </p>
                    </div>
                    <Link href="/">
                        <Button size="lg" className="rounded-full px-8">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartCount})</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex gap-4 md:gap-6 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                                >
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg md:text-xl line-clamp-1">{item.name}</h3>
                                                <p className="text-sm text-gray-500">Unit Price: ₹{item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 font-semibold text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 sticky top-28 border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button className="w-full py-6 rounded-full text-lg font-bold shadow-lg shadow-black/10 transition-transform active:scale-95">
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>

                            <p className="text-center text-xs text-gray-500 mt-6 mt-6">
                                Taxes and shipping calculated at checkout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
