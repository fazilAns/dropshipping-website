import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false, // Optional for OAuth users
        },
        image: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        provider: {
            type: String,
            default: 'credentials',
        },
    },
    { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
