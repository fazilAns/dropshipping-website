import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// ... (POST handler stays same or slightly updated)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const body = await req.json();
        await dbConnect();
        const newProduct = await Product.create(body);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        // Filters
        const query: any = {};

        const categorySlug = searchParams.get('category');
        const subcategorySlug = searchParams.get('subcategory');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const brand = searchParams.get('brand');
        const rating = searchParams.get('rating');
        const tags = searchParams.get('tags');
        const onSale = searchParams.get('onSale');
        const search = searchParams.get('search');
        const stock = searchParams.get('stock'); // 'in' or 'out'

        await dbConnect();

        // On Sale
        if (onSale === 'true') {
            query.discountPrice = { $gt: 0 };
        }

        // Tags (comma separated)
        if (tags) {
            const tagArray = tags.split(',').map(t => new RegExp(t.trim(), 'i'));
            query.tags = { $in: tagArray };
        }

        // Resolve Category Slug to ID
        if (categorySlug) {
            const cat = await Category.findOne({ slug: categorySlug });
            if (cat) query.category = cat._id;
        }

        // Resolve Subcategory Slug to ID
        if (subcategorySlug) {
            const sub = await Subcategory.findOne({ slug: subcategorySlug });
            if (sub) query.subcategory = sub._id;
        }

        // Price Range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Brand
        if (brand) {
            query.brand = { $regex: brand, $options: 'i' };
        }

        // Rating
        if (rating) {
            query.averageRating = { $gte: Number(rating) };
        }

        // Keyword Search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Availability
        if (stock === 'in') query.stock = { $gt: 0 };
        if (stock === 'out') query.stock = { $eq: 0 };

        // Sorting
        const sortParam = searchParams.get('sort') || 'newest';
        let sortOptions: any = { createdAt: -1 };
        if (sortParam === 'price-low') sortOptions = { price: 1 };
        if (sortParam === 'price-high') sortOptions = { price: -1 };
        if (sortParam === 'best-selling') sortOptions = { numReviews: -1 }; // Placeholder for best selling

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .populate('subcategory', 'name slug')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        return NextResponse.json({
            products,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ products: [], pagination: { total: 0, pages: 0, currentPage: 1, limit: 12 } });
    }
}
