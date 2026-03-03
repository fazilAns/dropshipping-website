import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Subcategory from '@/models/Subcategory';
import Product from '@/models/Product';

// PUT: Update subcategory
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, slug, category, description } = await req.json();
        await dbConnect();

        const subcategory = await Subcategory.findByIdAndUpdate(
            params.id,
            { name, slug, category, description },
            { new: true, runValidators: true }
        );

        if (!subcategory) {
            return NextResponse.json({ message: 'Subcategory not found' }, { status: 404 });
        }

        return NextResponse.json(subcategory);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE: Remove subcategory
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Check if products exist in this subcategory
        const productCount = await Product.countDocuments({ subcategory: params.id });
        if (productCount > 0) {
            return NextResponse.json({ message: 'Cannot delete subcategory with existing products' }, { status: 400 });
        }

        const subcategory = await Subcategory.findByIdAndDelete(params.id);
        if (!subcategory) {
            return NextResponse.json({ message: 'Subcategory not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subcategory deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
