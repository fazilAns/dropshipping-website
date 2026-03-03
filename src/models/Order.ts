import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number, // Snapshot of price at time of order
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentInfo: {
            method: {
                type: String,
                default: 'Razorpay',
            },
            razorpayOrderId: String,
            razorpayPaymentId: String,
            manualPaymentRef: String,
            status: {
                type: String,
                enum: ['pending', 'paid', 'verifying', 'failed'],
                default: 'pending',
            },
        },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
    },
    { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

const Order = models.Order || model('Order', OrderSchema);

export default Order;
