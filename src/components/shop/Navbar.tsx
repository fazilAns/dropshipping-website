'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, LogOut, LayoutDashboard, Package, ChevronDown, Search, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/providers/CartProvider';

export default function Navbar() {
    const router = useRouter();
    const { data: session } = useSession();
    const { cartCount } = useCart();

    // State for navigation and menus
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // State for Live Search
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const searchInputRef = useRef<HTMLInputElement>(null);

    // Fetch products for live search
    useEffect(() => {
        fetch('/api/products')
            .then(async res => {
                if (!res.ok) return [];
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    return [];
                }
                return res.json();
            })
            .then(data => {
                const list = Array.isArray(data) ? data : (data.products || []);
                setAllProducts(list);
            })
            .catch(err => {
                console.error('Failed to fetch products for search:', err);
                setAllProducts([]);
            });
    }, []);

    // Handle Live Search Filtering
    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            const filtered = allProducts
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 5);
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, allProducts]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <nav className={`fixed top-0 z-50 w-full transition-all duration-700 ${scrolled
            ? 'bg-white/80 dark:bg-black/90 backdrop-blur-3xl border-b border-gray-200/30 dark:border-gray-800/30 py-4 shadow-2xl'
            : 'bg-transparent py-8'
            }`}>
            <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between relative">

                {/* Search Overlay & Live Results */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-3xl z-[60] mt-1 pr-16 pl-8"
                        >
                            <div className="relative">
                                <form onSubmit={handleSearch} className="relative z-10">
                                    <div className="flex items-center bg-white rounded-full shadow-2xl border-4 border-black/5 ring-0 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all overflow-hidden group">
                                        <div className="pl-6 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Explore the collection..."
                                            className="w-full h-16 px-4 bg-transparent border-none outline-none font-bold text-gray-900 placeholder:text-gray-400 text-lg"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <div className="pr-4 flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setIsSearchOpen(false)}
                                                className="rounded-full hover:bg-gray-100 text-gray-400 hover:text-black"
                                            >
                                                <X className="w-6 h-6" />
                                            </Button>
                                        </div>
                                    </div>
                                </form>

                                {/* Live Suggestions Dropdown */}
                                <AnimatePresence>
                                    {suggestions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-20 left-0 w-full bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden py-4 z-0"
                                        >
                                            <div className="px-6 pb-2">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Match Results</p>
                                            </div>
                                            {suggestions.map((p) => (
                                                <Link
                                                    key={p._id}
                                                    href={`/product/${p._id}`}
                                                    onClick={() => setIsSearchOpen(false)}
                                                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group/item"
                                                >
                                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                                                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-gray-900 group-hover/item:text-blue-600 transition-colors">{p.name}</p>
                                                        <p className="text-xs font-bold text-gray-400 italic">₹{p.price.toLocaleString()}</p>
                                                    </div>
                                                    <ChevronDown className="w-5 h-5 text-gray-300 -rotate-90" />
                                                </Link>
                                            ))}
                                            <div className="mt-2 px-6 pt-2 border-t border-gray-50">
                                                <button
                                                    onClick={handleSearch}
                                                    className="text-xs font-black uppercase tracking-widest text-blue-500 hover:underline"
                                                >
                                                    Show all results for "{searchQuery}"
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Left Side: Brand */}
                <div className="flex items-center gap-16">
                    <Link href="/" className="group flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            className="w-12 h-12 bg-black dark:bg-white rounded-[14px] flex items-center justify-center transition-all duration-500 shadow-xl shadow-black/20"
                        >
                            <span className="text-white dark:text-black font-black text-2xl">D</span>
                        </motion.div>
                        <span className="font-black text-3xl tracking-tighter uppercase italic dark:text-white">
                            Dropship <span className="text-blue-600">Elite</span>
                        </span>
                    </Link>

                    {/* Nav Items */}
                    <div className="hidden xl:flex items-center gap-10">
                        {['Home', 'Shop', 'Track'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black dark:hover:text-white transition-all relative group py-2"
                            >
                                {item}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Side: Tools */}
                <div className="flex items-center gap-4">
                    {/* Search Trigger */}
                    <motion.button
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsSearchOpen(true)}
                        className="w-14 h-14 rounded-full flex items-center justify-center bg-transparent border-2 border-transparent hover:border-blue-600/20 hover:bg-blue-600/5 text-black dark:text-white transition-all group"
                    >
                        <Search className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
                    </motion.button>

                    {/* Cart Tool */}
                    <Link href="/cart">
                        <motion.div
                            whileHover={{ scale: 1.15 }}
                            className="relative w-14 h-14 rounded-full flex items-center justify-center bg-transparent hover:bg-blue-600 hover:text-white dark:text-white transition-all group shadow-blue-500/20 hover:shadow-2xl"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0, y: 10 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-lg"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </motion.div>
                    </Link>

                    {/* User Profile / Connect */}
                    {session ? (
                        <div className="relative ml-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-4 px-2 py-2 rounded-full border-2 border-gray-100 dark:border-gray-800 hover:border-blue-600/40 bg-white/50 dark:bg-black/50 backdrop-blur-xl transition-all h-14 shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-black shadow-lg">
                                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                        className="absolute right-0 mt-6 w-72 bg-white dark:bg-black border border-gray-200/50 dark:border-gray-800/50 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.2)] py-4 z-50 overflow-hidden"
                                    >
                                        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-900 mb-2 bg-gray-50/50 dark:bg-white/5">
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] mb-1.5 flex items-center gap-2">
                                                <Zap className="w-3 h-3 fill-current" /> Premium Access
                                            </p>
                                            <p className="text-xl font-black truncate text-black dark:text-white italic tracking-tighter">
                                                {session.user.name}
                                            </p>
                                        </div>

                                        <div className="space-y-1 px-3">
                                            {[
                                                { label: 'Orders', href: '/orders', icon: Package, role: 'user' },
                                                { label: 'Admin', href: '/admin', icon: LayoutDashboard, role: 'admin' }
                                            ].map((link) => (
                                                (link.role === 'user' || session.user.role === 'admin') && (
                                                    <Link
                                                        key={link.label}
                                                        href={link.href}
                                                        className="flex items-center gap-4 px-4 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        <link.icon className="w-5 h-5" />
                                                        {link.label}
                                                    </Link>
                                                )
                                            ))}
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-4 px-4 py-4 text-[11px] font-black uppercase tracking-widest text-red-500 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                Disconnect
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/login" className="ml-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-[11px] px-10 h-14 rounded-full flex items-center justify-center shadow-xl shadow-black/10 transition-all"
                            >
                                Connect
                            </motion.div>
                        </Link>
                    )}

                    {/* Mobile Menu */}
                    <Button variant="ghost" size="icon" className="xl:hidden rounded-full w-14 h-14 ml-2">
                        <Menu className="w-7 h-7" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
