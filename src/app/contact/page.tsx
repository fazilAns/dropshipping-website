'use client';

import { useState } from 'react';
import Navbar from '@/components/shop/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success('Message sent! Our team will get back to you within 24 hours.');
            setLoading(false);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[#fafafa] dark:bg-black">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-sm"
                            >
                                <div className="w-8 h-[2px] bg-primary"></div>
                                Get In Touch
                            </motion.div>
                            <h1 className="text-6xl font-black tracking-tighter leading-tight uppercase italic">
                                We're here to <br /> <span className="text-gray-400">help you.</span>
                            </h1>
                            <p className="text-gray-500 text-lg max-w-md">
                                Have questions about an order or a product? Our dedicated support team is available 24/7 to assist you.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <Card className="rounded-3xl border-none shadow-xl bg-white dark:bg-gray-900 p-8 space-y-4 hover:scale-105 transition-transform cursor-default">
                                <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Email Support</p>
                                    <p className="font-black text-lg">support@yourstore.com</p>
                                </div>
                            </Card>
                            <Card className="rounded-3xl border-none shadow-xl bg-white dark:bg-gray-900 p-8 space-y-4 hover:scale-105 transition-transform cursor-default">
                                <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Call Us</p>
                                    <p className="font-black text-lg">+1 (234) 567-890</p>
                                </div>
                            </Card>
                        </div>

                        <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black italic uppercase">Live Support</h3>
                            </div>
                            <p className="text-gray-400">Our average response time is under 15 minutes. Click the chat bubble if you need immediate help.</p>
                            <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                                Start Live Chat
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-gray-900">
                        <CardContent className="p-12 space-y-8">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                        <Input required placeholder="John Doe" className="h-14 rounded-2xl bg-gray-50 dark:bg-black/50 border-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                                        <Input required type="email" placeholder="john@example.com" className="h-14 rounded-2xl bg-gray-50 dark:bg-black/50 border-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                                    <Input required placeholder="Order Question" className="h-14 rounded-2xl bg-gray-50 dark:bg-black/50 border-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                                    <Textarea required placeholder="Tell us what you need..." className="min-h-[150px] rounded-3xl bg-gray-50 dark:bg-black/50 border-none font-bold p-6" />
                                </div>
                                <Button disabled={loading} className="w-full h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-lg hover:scale-[1.02] transition-transform">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Send Message'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
