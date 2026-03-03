import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { razorpay } from '@/lib/razorpay';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { amount, productId, quantity } = await req.json();
        await dbConnect();

        let finalAmount = amount;

        // Securely calculate amount if its a 'Buy Now' purchase
        if (productId) {
            const Product = (await import('@/models/Product')).default;
            const product = await Product.findById(productId);
            if (!product) {
                return NextResponse.json({ message: 'Product not found' }, { status: 404 });
            }
            finalAmount = product.price * (quantity || 1);
        }

        if (!finalAmount || finalAmount <= 0) {
            return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
        }

        const options = {
            amount: Math.round(finalAmount * 100), // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error('Razorpay order error:', error);
        // Provide more descriptive error if possible
        const message = error.description || error.message || 'Failed to create order';
        return NextResponse.json({ message }, { status: 500 });
    }
}
