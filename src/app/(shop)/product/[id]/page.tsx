'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Navbar from '@/components/shop/Navbar';
import { useCart } from '@/components/providers/CartProvider';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    category: string;
    stock: number;
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading || !product) return <div className="text-center py-20">Loading product...</div>;

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
                            <Image
                                src={selectedImage || 'https://via.placeholder.com/600'}
                                alt={product.name}
                                fill
                                unoptimized
                                className="object-cover w-full h-full"
                            />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img
                                            ? 'border-black dark:border-white ring-2 ring-offset-2 ring-black dark:ring-white'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${idx}`}
                                            fill
                                            unoptimized
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">{product.category}</p>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">{product.name}</h1>
                        </div>

                        <div className="text-3xl font-bold">₹{(product.price || 0).toLocaleString()}</div>

                        <div className="prose dark:prose-invert">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="px-4 font-medium">{quantity}</span>
                                    <button
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
                                        onClick={() => setQuantity(quantity + 1)}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="flex-1 px-8 text-lg py-7 rounded-full border-2"
                                    disabled={product.stock <= 0}
                                    onClick={() => addToCart(product, quantity)}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </Button>
                                <Button
                                    size="lg"
                                    className="flex-1 px-8 text-lg py-7 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                                    disabled={product.stock <= 0}
                                    onClick={() => {
                                        router.push(`/checkout?productId=${product._id}&quantity=${quantity}`);
                                    }}
                                >
                                    Buy Now
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-8 text-sm text-gray-500">
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Fast Delivery</h4>
                                <p>Ships within 24 hours</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Payment</h4>
                                <p>100% secure checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
