'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';

interface Product {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    description: string;
    images: string[];
    category: any; // Can be object or string
    averageRating?: number;
    numReviews?: number;
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const primaryImage = product.images?.[0] || 'https://via.placeholder.com/400';
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const categoryName = typeof product.category === 'object' ? product.category.name : product.category;

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <Link href={`/product/${product._id}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />

                    {hasDiscount && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                            Sale
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{categoryName}</p>
                        {product.averageRating !== undefined && product.averageRating > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold">{product.averageRating}</span>
                                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                            </div>
                        )}
                    </div>
                    <Link href={`/product/${product._id}`}>
                        <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm">{product.name}</h3>
                    </Link>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <>
                                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                                <span className="font-black text-lg text-red-600">₹{product.discountPrice}</span>
                            </>
                        ) : (
                            <span className="font-black text-lg">₹{product.price}</span>
                        )}
                    </div>
                    <Button
                        size="icon"
                        className="rounded-full w-10 h-10 shadow-lg shadow-black/10 active:scale-90 transition-transform"
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
