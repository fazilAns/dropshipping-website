import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await req.json();

        await dbConnect();

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
    }
}
