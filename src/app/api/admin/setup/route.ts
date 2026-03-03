import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET: Check if an admin user already exists
export async function GET() {
    try {
        await dbConnect();
        const adminCount = await User.countDocuments({ role: 'admin' });

        return NextResponse.json({ adminExists: adminCount > 0 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error checking admin status' },
            { status: 500 }
        );
    }
}

// POST: One-time admin promotion
export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. Check if an admin already exists — if so, setup is permanently disabled
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount > 0) {
            return NextResponse.json(
                { message: 'Setup is disabled. An admin already exists.' },
                { status: 403 }
            );
        }

        // 2. Ensure the user is authenticated
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'You must be logged in to use setup.' },
                { status: 401 }
            );
        }

        // 3. Validate the setup secret from environment variable
        const { secret } = await req.json();
        const envSecret = process.env.ADMIN_SETUP_SECRET;

        if (!envSecret) {
            return NextResponse.json(
                { message: 'ADMIN_SETUP_SECRET is not configured on the server.' },
                { status: 500 }
            );
        }

        if (secret !== envSecret) {
            return NextResponse.json(
                { message: 'Invalid setup secret.' },
                { status: 401 }
            );
        }

        // 4. Promote the authenticated user to admin
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { message: 'User not found in database.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'User promoted to admin successfully.',
            user: { name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error during admin setup.' },
            { status: 500 }
        );
    }
}
