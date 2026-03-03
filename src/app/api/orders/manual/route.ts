import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        const session = (await getServerSession(authOptions)) as any;
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const {
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            transactionId
        } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
        }

        await dbConnect();

        const order = await Order.create({
            user: session.user._id,
            items: items.map((item: any) => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount,
            status: 'pending',
            paymentInfo: {
                method: paymentMethod,
                manualPaymentRef: transactionId,
                status: 'verifying',
            },
            shippingAddress,
        });

        return NextResponse.json({
            message: 'Order created and pending verification',
            orderId: order._id
        }, { status: 201 });
    } catch (error: any) {
        console.error('Manual order error:', error);
        return NextResponse.json({
            message: 'Failed to create order',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
