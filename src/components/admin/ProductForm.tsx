'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ProductFormProps {
    initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);
    const [previews, setPreviews] = useState<string[]>(initialData?.images || []);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        discountPrice: initialData?.discountPrice || '',
        category: initialData?.category?._id || initialData?.category || '',
        subcategory: initialData?.subcategory?._id || initialData?.subcategory || '',
        brand: initialData?.brand || '',
        tags: initialData?.tags?.join(', ') || '',
        images: initialData?.images || [],
        stock: initialData?.stock || 0,
    });

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const [catsRes, subsRes] = await Promise.all([
                fetch('/api/admin/categories'),
                fetch('/api/admin/subcategories')
            ]);
            const cats = await catsRes.json();
            const subs = await subsRes.json();
            setCategories(cats);
            setSubcategories(subs);

            if (initialData?.category) {
                const parentId = initialData.category?._id || initialData.category;
                setAvailableSubcategories(subs.filter((s: any) => (s.category?._id || s.category) === parentId));
            }
        } catch (error) {
            toast.error('Failed to load category metadata');
        }
    };

    const handleCategoryChange = (catId: string) => {
        setFormData({ ...formData, category: catId, subcategory: '' });
        setAvailableSubcategories(subcategories.filter((s: any) => (s.category?._id || s.category) === catId));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages = [...formData.images];
        const newPreviews = [...previews];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validation
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`${file.name} is too large. Max 2MB.`);
                continue;
            }

            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            try {
                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                newImages.push(data.url);
                newPreviews.push(data.url);
            } catch (error: any) {
                toast.error(`Upload failed for ${file.name}: ${error.message}`);
            }
        }

        setFormData({ ...formData, images: newImages });
        setPreviews(newPreviews);
        setUploading(false);
    };

    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_: any, i: number) => i !== index);
        const newPreviews = previews.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, images: newImages });
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = initialData
                ? `/api/products/${initialData._id}`
                : '/api/products';
            const method = initialData ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                price: Number(formData.price),
                discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('Failed to save product');
            }

            toast.success(
                initialData ? 'Product updated' : 'Product created'
            );
            router.refresh();
            router.push('/admin/products');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-gray-400">Product Name</Label>
                        <Input
                            id="name"
                            className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 focus:ring-black dark:focus:ring-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Wireless Noise Canceling Headphones"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-bold uppercase tracking-wider text-gray-400">Category</Label>
                            <select
                                id="category"
                                className="w-full h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 px-4 py-2 text-sm focus:ring-black dark:focus:ring-white outline-none"
                                value={formData.category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subcategory" className="text-sm font-bold uppercase tracking-wider text-gray-400">Subcategory</Label>
                            <select
                                id="subcategory"
                                className="w-full h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 px-4 py-2 text-sm focus:ring-black dark:focus:ring-white outline-none"
                                value={formData.subcategory}
                                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                required
                                disabled={!formData.category}
                            >
                                <option value="">Select Subcategory</option>
                                {availableSubcategories.map(s => (
                                    <option key={s._id} value={s._id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand" className="text-sm font-bold uppercase tracking-wider text-gray-400">Brand</Label>
                            <Input
                                id="brand"
                                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="e.g. Sony"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags" className="text-sm font-bold uppercase tracking-wider text-gray-400">Tags</Label>
                            <Input
                                id="tags"
                                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="sale, new, featured"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-bold uppercase tracking-wider text-gray-400">Regular Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discountPrice" className="text-sm font-bold uppercase tracking-wider text-gray-400">Discount Price (₹)</Label>
                            <Input
                                id="discountPrice"
                                type="number"
                                className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20"
                                value={formData.discountPrice}
                                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stock" className="text-sm font-bold uppercase tracking-wider text-gray-400">Stock</Label>
                        <Input
                            id="stock"
                            type="number"
                            className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-gray-400">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[120px] w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 px-4 py-3 text-sm focus:ring-black dark:focus:ring-white outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the product features and benefits..."
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <Label className="text-sm font-bold uppercase tracking-wider text-gray-400">Product Images</Label>

                        <div className="grid grid-cols-3 gap-4">
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 group">
                                    <Image
                                        src={src}
                                        alt={`Preview ${index}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors cursor-pointer bg-gray-50/50 dark:bg-black/10">
                                {uploading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                ) : (
                                    <>
                                        <ImagePlus className="w-6 h-6 text-gray-400" />
                                        <span className="text-[10px] mt-2 text-gray-500 font-medium">Add Image</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        <p className="text-[10px] text-gray-400">Upload high-quality JPEG, PNG or WebP images (Max 2MB each).</p>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 px-12 rounded-full text-lg font-bold shadow-xl shadow-black/10 active:scale-95 transition-transform"
                >
                    {loading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form >
    );
}

