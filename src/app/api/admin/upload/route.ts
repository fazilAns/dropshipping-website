import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    try {
        // 1. Authenticate user
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse form data
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        // 3. Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // 4. Validate file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { message: 'File is too large. Maximum size is 2MB.' },
                { status: 400 }
            );
        }

        // 5. Prepare storage directory
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        // 6. Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;
        const path = join(uploadDir, fileName);

        // 7. Save file
        await writeFile(path, buffer);
        const fileUrl = `/uploads/${fileName}`;

        return NextResponse.json({
            message: 'Upload successful',
            url: fileUrl
        }, { status: 201 });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error during upload' },
            { status: 500 }
        );
    }
}
