import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

const Category = models.Category || model('Category', CategorySchema);

export default Category;
