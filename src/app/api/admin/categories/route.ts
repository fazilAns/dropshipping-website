import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

// GET all categories
export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json(categories);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST create new category
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, slug, description } = await req.json();

        if (!name || !slug) {
            return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
        }

        await dbConnect();
        const category = await Category.create({ name, slug, description });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'Category or slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
