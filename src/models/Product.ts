import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        images: {
            type: [String],
            required: [true, 'At least one product image is required'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required'],
        },
        subcategory: {
            type: Schema.Types.ObjectId,
            ref: 'Subcategory',
            required: [true, 'Product subcategory is required'],
        },
        brand: {
            type: String,
            trim: true,
        },
        discountPrice: {
            type: Number,
            min: [0, 'Discount price cannot be negative'],
        },
        tags: {
            type: [String],
            default: [],
        },
        ratings: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        averageRating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ createdAt: -1 });

const Product = models.Product || model('Product', ProductSchema);

export default Product;
