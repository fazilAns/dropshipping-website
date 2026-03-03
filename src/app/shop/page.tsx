'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/shop/Navbar';
import ProductCard from '@/components/shop/product-list/ProductCard';
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import FilterSidebar from '@/components/shop/FilterSidebar';
import SortBar from '@/components/shop/SortBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ShopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products?${searchParams.toString()}`);
                const data = await res.json();
                setProducts(data.products || []);
                setPagination(data.pagination || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams]);

    const changePage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-12">
                    {/* Left Sidebar - Filters */}
                    <FilterSidebar />

                    {/* Main Content */}
                    <div className="flex-1">
                        <SortBar total={pagination?.total || 0} />

                        {loading ? (
                            <div className="flex h-[40vh] items-center justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-bold mb-2">No products found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                                <Button
                                    variant="link"
                                    onClick={() => router.push('/shop')}
                                    className="mt-4"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map((product: any) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {pagination && pagination.pages > 1 && (
                                    <div className="mt-16 flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => changePage(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="rounded-full h-11 w-11"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </Button>

                                        {[...Array(pagination.pages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            const isActive = pagination.currentPage === pageNum;

                                            // Simple logic to show current, first, last and neighbors
                                            if (
                                                pagination.pages > 7 &&
                                                pageNum !== 1 &&
                                                pageNum !== pagination.pages &&
                                                Math.abs(pageNum - pagination.currentPage) > 1
                                            ) {
                                                if (Math.abs(pageNum - pagination.currentPage) === 2) {
                                                    return <span key={pageNum} className="px-2 text-gray-400">...</span>;
                                                }
                                                return null;
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={isActive ? 'default' : 'ghost'}
                                                    onClick={() => changePage(pageNum)}
                                                    className={`rounded-full h-11 w-11 font-bold ${isActive ? 'shadow-lg shadow-black/10' : ''}`}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => changePage(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.pages}
                                            className="rounded-full h-11 w-11"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="flex bg-white dark:bg-black min-h-screen items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
