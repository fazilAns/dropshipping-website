import mongoose, { Schema, model, models } from 'mongoose';

const SubcategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Subcategory name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            lowercase: true,
            trim: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Parent category is required'],
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

// Ensure name is unique within the same category
SubcategorySchema.index({ name: 1, category: 1 }, { unique: true });
SubcategorySchema.index({ slug: 1, category: 1 }, { unique: true });

const Subcategory = models.Subcategory || model('Subcategory', SubcategorySchema);

export default Subcategory;
