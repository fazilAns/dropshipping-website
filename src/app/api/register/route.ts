import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        try {
            await dbConnect();
        } catch (dbError) {
            console.error('Registration Database Connection Error:', dbError);
            return NextResponse.json(
                { message: 'Database is currently offline. Please try again later.' },
                { status: 503 }
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        const adminCount = await User.countDocuments({ role: 'admin' });
        const role = adminCount === 0 ? 'admin' : 'user';

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
