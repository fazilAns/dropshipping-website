import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Subcategory from '@/models/Subcategory';

// GET all subcategories
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId');

        await dbConnect();
        const query = categoryId ? { category: categoryId } : {};
        const subcategories = await Subcategory.find(query).populate('category').sort({ name: 1 });

        return NextResponse.json(subcategories);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST create new subcategory
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, slug, category, description } = await req.json();

        if (!name || !slug || !category) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        const subcategory = await Subcategory.create({ name, slug, category, description });

        return NextResponse.json(subcategory, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ message: 'Subcategory or slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
