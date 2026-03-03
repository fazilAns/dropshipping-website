'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Greeting() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 3500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-3xl"
                >
                    <div className="text-center px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.2
                            }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl md:text-3xl font-black text-gray-400 uppercase tracking-[0.4em] italic mb-6">
                                Hello 👋
                            </h2>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-600">
                                Welcome to <br />
                                <span className="text-blue-600">DROPSHIP Elite</span>
                            </h1>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100px' }}
                                transition={{ duration: 1.5, delay: 0.8 }}
                                className="h-1 bg-blue-600 mx-auto rounded-full mt-12"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
