import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const session = (await getServerSession(authOptions)) as any;
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            totalAmount,
            shippingAddress
        } = await req.json();

        // Verify Signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
        }

        // Save order to database
        await dbConnect();

        const order = await Order.create({
            user: session.user._id,
            items: items.map((item: any) => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount,
            status: 'processing',
            paymentInfo: {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                status: 'paid',
            },
            shippingAddress,
        });

        return NextResponse.json({ message: 'Order created successfully', orderId: order._id }, { status: 201 });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({ message: 'Failed to verify payment' }, { status: 500 });
    }
}
