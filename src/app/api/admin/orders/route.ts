import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product')
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Fetch admin orders error:', error);
        return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
    }
}
