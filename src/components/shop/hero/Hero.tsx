'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Greeting from './Greeting';
import { ChevronRight, Star } from 'lucide-react';

export default function Hero() {
    // Base delay to match Greeting duration
    const introDelay = 3.5;

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-black py-20 px-4">
            {/* Background Decorative Elements - Appear slightly earlier for atmosphere */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 2, delay: introDelay - 1 }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-200/50 dark:bg-purple-900/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-200/50 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: introDelay }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium"
                    >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>Premium Dropshipping Experience</span>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: introDelay + 0.2 }}
                            className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] dark:text-white"
                        >
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-400 dark:to-gray-600">Lifestyle.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: introDelay + 0.4 }}
                            className="text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Curated premium products delivered with lightning speed. Experience the next generation of dropshipping.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: introDelay + 0.6 }}
                        className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5"
                    >
                        <Link href="/shop">
                            <Button size="lg" className="h-16 px-10 rounded-full bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform text-lg font-bold group">
                                Shop Collection
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="h-16 px-10 rounded-full border-2 text-lg font-bold hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white">
                            Our Story
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: introDelay + 0.8 }}
                        className="flex items-center justify-center lg:justify-start gap-12 pt-8 border-t border-gray-100 dark:border-gray-900"
                    >
                        <div className="dark:text-white">
                            <p className="text-3xl font-black">50k+</p>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Customers</p>
                        </div>
                        <div className="dark:text-white">
                            <p className="text-3xl font-black">4.9/5</p>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Rating</p>
                        </div>
                        <div className="dark:text-white">
                            <p className="text-3xl font-black">24h</p>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Support</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: introDelay + 0.4 }}
                    className="relative hidden lg:block"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-[4rem] blur-3xl -z-10 animate-pulse"></div>
                    <div className="relative aspect-square rounded-[4rem] overflow-hidden border-8 border-white dark:border-gray-900 shadow-2xl rotate-3">
                        <img
                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                            alt="Premium Product"
                            className="object-cover w-full h-full hover:scale-110 transition-transform duration-1000"
                        />
                    </div>

                    {/* Floating Info Cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-8 -right-8 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-gray-100 dark:border-gray-800"
                    >
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Trending</p>
                            <p className="font-black dark:text-white">Premium Gadgets</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Greeting />
        </section>
    );
}
