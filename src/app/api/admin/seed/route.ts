import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';

export async function GET() {
    try {
        await dbConnect();

        // Check if data already exists
        const count = await Category.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: 'Database already has categories' });
        }

        const cats = [
            { name: 'Electronics', slug: 'electronics' },
            { name: 'Clothing', slug: 'clothing' },
            { name: 'Home & Kitchen', slug: 'home-kitchen' }
        ];

        const createdCats = await Category.insertMany(cats);

        const subs = [
            { name: 'Smartphones', slug: 'smartphones', category: createdCats[0]._id },
            { name: 'Laptops', slug: 'laptops', category: createdCats[0]._id },
            { name: 'T-Shirts', slug: 't-shirts', category: createdCats[1]._id },
            { name: 'Jeans', slug: 'jeans', category: createdCats[1]._id },
            { name: 'Cookware', slug: 'cookware', category: createdCats[2]._id }
        ];

        await Subcategory.insertMany(subs);

        return NextResponse.json({ message: 'Seeded successfully', categories: createdCats });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
