'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    category: string;
}

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                // Support both old array format and new object format
                const productList = Array.isArray(data) ? data : (data.products || []);
                setProducts(productList);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20 col-span-full">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No products found</h3>
                <p className="text-gray-500">Check back later for new arrivals.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}
