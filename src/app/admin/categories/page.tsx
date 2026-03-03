'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, FolderTree, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<any>(null);
    const [editType, setEditType] = useState<'category' | 'subcategory'>('category');

    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        category: '', // parent for subcategory
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catsRes, subsRes] = await Promise.all([
                fetch('/api/admin/categories'),
                fetch('/api/admin/subcategories')
            ]);
            const cats = await catsRes.json();
            const subs = await subsRes.json();
            setCategories(cats);
            setSubcategories(subs);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editType === 'category'
            ? (isEditing ? `/api/admin/categories/${itemToEdit._id}` : '/api/admin/categories')
            : (isEditing ? `/api/admin/subcategories/${itemToEdit._id}` : '/api/admin/subcategories');

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }

            toast.success(`${editType === 'category' ? 'Category' : 'Subcategory'} ${isEditing ? 'updated' : 'created'}`);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (type: 'category' | 'subcategory', id: string) => {
        if (!confirm('Are you sure you want to delete this?')) return;

        try {
            const res = await fetch(`/api/admin/${type === 'category' ? 'categories' : 'subcategories'}/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }

            toast.success('Deleted successfully');
            fetchData();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setForm({ name: '', slug: '', description: '', category: '' });
        setIsEditing(false);
        setItemToEdit(null);
    };

    const startEdit = (type: 'category' | 'subcategory', item: any) => {
        setEditType(type);
        setItemToEdit(item);
        setIsEditing(true);
        setForm({
            name: item.name,
            slug: item.slug,
            description: item.description || '',
            category: type === 'subcategory' ? item.category?._id || item.category : '',
        });
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            {isEditing ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                            {isEditing ? `Edit ${editType === 'category' ? 'Category' : 'Subcategory'}` : 'Create New'}
                        </h2>

                        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => { setEditType('category'); resetForm(); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${editType === 'category' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'}`}
                            >
                                Category
                            </button>
                            <button
                                onClick={() => { setEditType('subcategory'); resetForm(); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${editType === 'subcategory' ? 'bg-white dark:bg-gray-800 shadow-sm' : 'text-gray-500'}`}
                            >
                                Subcategory
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {editType === 'subcategory' && (
                                <div className="space-y-2">
                                    <Label>Parent Category</Label>
                                    <select
                                        className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                        setForm({ ...form, name, slug });
                                    }}
                                    placeholder="e.g. Electronics"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    placeholder="e.g. electronics"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <textarea
                                    className="w-full min-h-[80px] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" className="flex-1">
                                    {isEditing ? 'Update' : 'Create'}
                                </Button>
                                {isEditing && (
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-6">
                    {categories.map((category) => (
                        <div key={category._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gray-50/50 dark:bg-black/10 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {category.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{category.name}</h3>
                                        <p className="text-xs text-gray-500">{category.slug}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => startEdit('category', category)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete('category', category._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    <FolderTree className="w-3 h-3" />
                                    Subcategories
                                </div>

                                {subcategories.filter(s => (s.category?._id || s.category) === category._id).length === 0 ? (
                                    <p className="text-sm text-gray-400 italic py-2 px-4">No subcategories yet</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {subcategories.filter(s => (s.category?._id || s.category) === category._id).map((sub) => (
                                            <div key={sub._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 group">
                                                <div className="flex items-center gap-2">
                                                    <ChevronRight className="w-3 h-3 text-gray-400" />
                                                    <span className="text-sm font-medium">{sub.name}</span>
                                                </div>
                                                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit('subcategory', sub)}>
                                                        <Pencil className="w-3 h-3" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete('subcategory', sub._id)}>
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && !loading && (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500">No categories found. Create your first one!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
