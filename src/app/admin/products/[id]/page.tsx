'use client';

import { use, useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
            <ProductForm initialData={product} />
        </div>
    );
}
