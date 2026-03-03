import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: Request) {
    try {
        const session = (await getServerSession(authOptions)) as any;
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const orders = await Order.find({ user: session.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
    }
}
