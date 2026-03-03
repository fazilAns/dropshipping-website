'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, ChevronDown, ChevronRight } from 'lucide-react';

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [expandedCats, setExpandedCats] = useState<string[]>([]);

    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
    });

    useEffect(() => {
        fetch('/api/admin/categories').then(res => res.json()).then(setCategories);
        fetch('/api/admin/subcategories').then(res => res.json()).then(setSubcategories);
    }, []);

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset pagination
        router.push(`/shop?${params.toString()}`);
    };

    const toggleCat = (catId: string) => {
        setExpandedCats(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const ratings = [4, 3, 2, 1];

    return (
        <div className="space-y-8 w-64 flex-shrink-0 hidden lg:block">
            {/* Categories */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Categories</h3>
                <div className="space-y-1">
                    {categories.map(cat => (
                        <div key={cat._id} className="space-y-1">
                            <div
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${searchParams.get('category') === cat.slug ? 'bg-black/5 dark:bg-white/5 font-bold' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                onClick={() => updateFilter('category', searchParams.get('category') === cat.slug ? null : cat.slug)}
                            >
                                <span className="text-sm">{cat.name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleCat(cat._id); }}
                                    className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded"
                                >
                                    {expandedCats.includes(cat._id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                </button>
                            </div>

                            {expandedCats.includes(cat._id) && (
                                <div className="ml-4 space-y-1">
                                    {subcategories.filter(s => (s.category?._id || s.category) === cat._id).map(sub => (
                                        <div
                                            key={sub._id}
                                            className={`p-2 text-xs rounded-lg cursor-pointer transition-colors ${searchParams.get('subcategory') === sub.slug ? 'text-primary font-bold' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                                            onClick={() => updateFilter('subcategory', searchParams.get('subcategory') === sub.slug ? null : sub.slug)}
                                        >
                                            {sub.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Offers */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Offers</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                        checked={searchParams.get('onSale') === 'true'}
                        onChange={() => updateFilter('onSale', searchParams.get('onSale') === 'true' ? null : 'true')}
                    />
                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors font-medium">
                        On Sale
                    </span>
                    <span className="ml-auto text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold uppercase">Hot</span>
                </label>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full h-10 px-3 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg outline-none focus:ring-1 focus:ring-black"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        onBlur={() => updateFilter('minPrice', priceRange.min)}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full h-10 px-3 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg outline-none focus:ring-1 focus:ring-black"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        onBlur={() => updateFilter('maxPrice', priceRange.max)}
                    />
                </div>
            </div>

            {/* Tags (Color/Size/Features) */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {['New', 'Premium', 'Eco-Friendly', 'Red', 'Blue', 'XL', 'S'].map(tag => {
                        const activeTags = searchParams.get('tags')?.split(',') || [];
                        const isActive = activeTags.includes(tag);

                        return (
                            <button
                                key={tag}
                                onClick={() => {
                                    const newTags = isActive
                                        ? activeTags.filter(t => t !== tag)
                                        : [...activeTags, tag];
                                    updateFilter('tags', newTags.length > 0 ? newTags.join(',') : null);
                                }}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${isActive
                                    ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                                    : 'border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Availability */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Availability</h3>
                <div className="space-y-2">
                    {['in', 'out'].map(stock => (
                        <label key={stock} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                checked={searchParams.get('stock') === stock}
                                onChange={() => updateFilter('stock', searchParams.get('stock') === stock ? null : stock)}
                            />
                            <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                                {stock === 'in' ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Ratings */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Rating</h3>
                <div className="space-y-2">
                    {ratings.map(r => (
                        <div
                            key={r}
                            className={`flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-lg transition-colors ${searchParams.get('rating') === r.toString() ? 'bg-black/5 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            onClick={() => updateFilter('rating', searchParams.get('rating') === r.toString() ? null : r.toString())}
                        >
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 group-hover:text-black">& Up</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => router.push('/shop')}
                className="w-full py-3 mt-4 text-xs font-bold border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    );
}
