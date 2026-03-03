'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProductGrid from './product-list/ProductGrid';

export default function FeaturedCollection() {
    return (
        <section className="py-24 px-4 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-sm"
                        >
                            <div className="w-8 h-[2px] bg-primary"></div>
                            Trending Now
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black"
                        >
                            Curated Collection
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <Link href="/shop">
                            <Button variant="ghost" className="text-lg font-bold group">
                                View Entire Shop
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <ProductGrid />
            </div>
        </section>
    );
}
