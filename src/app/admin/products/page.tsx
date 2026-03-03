'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    _id: string;
    name: string;
    price: number;
    category: any; // Can be object or string
    stock: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?limit=100'); // Get more for the list
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.products || []);
            setProducts(list);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ... (handleDelete code stays same, but I'll update the table part below)
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success('Product deleted');
            fetchProducts();
        } catch (error) {
            toast.error('Error deleting product');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading catalog...</td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No products found.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white uppercase tracking-tighter">{product.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                            {typeof product.category === 'object' ? product.category.name : product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${product.stock > 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/admin/products/${product._id}`}>
                                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full">
                                                <Pencil className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-9 h-9 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            <Trash className="w-4 h-4 text-red-400" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
