import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: orderId } = await params;

        if (!orderId || orderId.length < 10) {
            return NextResponse.json({ message: 'Invalid Order ID' }, { status: 400 });
        }

        await dbConnect();

        // Find order by ID and populate basic info
        const order = await Order.findById(orderId)
            .select('status createdAt shippingAddress totalAmount items')
            .populate('items.product', 'name images');

        if (!order) {
            return NextResponse.json({ message: 'Order not found. Please check your ID.' }, { status: 404 });
        }

        // Mock delivery estimation based on creation date (e.g. 7 days after)
        const createdAt = new Date(order.createdAt);
        const estimatedDelivery = new Date(createdAt);
        estimatedDelivery.setDate(createdAt.getDate() + 7);

        return NextResponse.json({
            id: order._id,
            status: order.status,
            createdAt: order.createdAt,
            estimatedDelivery: estimatedDelivery.toISOString(),
            shippingTo: `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
            itemsCount: order.items.length,
            total: order.totalAmount
        });

    } catch (error: any) {
        console.error('Tracking API error:', error);
        return NextResponse.json({ message: 'Error fetching order details' }, { status: 500 });
    }
}
