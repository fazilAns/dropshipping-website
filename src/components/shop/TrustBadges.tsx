'use client';

import { ShieldCheck, Truck, RotateCcw, Headset } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
    {
        icon: Truck,
        title: 'Global Shipping',
        description: 'Premium delivery to over 50 countries worldwide.',
        color: 'bg-blue-500/10 text-blue-600'
    },
    {
        icon: ShieldCheck,
        title: 'Verified Payments',
        description: 'Secure transaction processing with 256-bit encryption.',
        color: 'bg-green-500/10 text-green-600'
    },
    {
        icon: RotateCcw,
        title: 'Easy Returns',
        description: '30-day hassle-free return policy for all orders.',
        color: 'bg-orange-500/10 text-orange-600'
    },
    {
        icon: Headset,
        title: '24/7 Priority',
        description: 'Dedicated support team ready to assist you any time.',
        color: 'bg-purple-500/10 text-purple-600'
    }
];

export default function TrustBadges() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900/40">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center space-y-4"
                        >
                            <div className={`w-16 h-16 rounded-3xl ${benefit.color} flex items-center justify-center mb-2`}>
                                <benefit.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black">{benefit.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
