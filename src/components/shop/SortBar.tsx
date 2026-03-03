'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

interface SortBarProps {
    total: number;
}

export default function SortBar({ total }: SortBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateSort = (val: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', val);
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Showing <span className="font-bold text-black dark:text-white">{total}</span> products</span>
                <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                <button className="lg:hidden flex items-center gap-2 text-sm font-bold">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1 rounded-lg">
                    <button className="p-1.5 bg-white dark:bg-gray-800 rounded shadow-sm">
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-black transition-colors">
                        <List className="w-4 h-4" />
                    </button>
                </div>

                <select
                    className="h-10 pl-3 pr-8 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-1 focus:ring-black appearance-none cursor-pointer"
                    value={searchParams.get('sort') || 'newest'}
                    onChange={(e) => updateSort(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="best-selling">Best Selling</option>
                </select>
            </div>
        </div>
    );
}
