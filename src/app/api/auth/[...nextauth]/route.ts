import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Optimistic Database Pre-warming
// This triggers a background non-blocking connection to MongoDB as soon as the
// Serverless lambda cold starts, shaving 2-3 seconds off the first Google Login.
dbConnect().catch(console.error);

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                try {
                    await dbConnect();
                } catch (dbError) {
                    console.error('Database connection failed:', dbError);
                    throw new Error('Database connection failed. Please try again later.');
                }

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error('Incorrect password');
                }

                // Auto-promote to admin if no admins exist in the system
                if (user.role !== 'admin') {
                    const adminCount = await User.countDocuments({ role: 'admin' });
                    if (adminCount === 0) {
                        user.role = 'admin';
                        await user.save();
                    }
                }

                return {
                    id: user._id.toString(),
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    await dbConnect();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        const adminCount = await User.countDocuments({ role: 'admin' });
                        const role = adminCount === 0 ? 'admin' : 'user';

                        const newUser = await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            provider: 'google',
                            role,
                        });
                        user.id = newUser._id.toString();
                        (user as any).role = newUser.role;
                    } else {
                        // Check for admin presence even for existing users
                        if (existingUser.role !== 'admin') {
                            const adminCount = await User.countDocuments({ role: 'admin' });
                            if (adminCount === 0) {
                                existingUser.role = 'admin';
                                await existingUser.save();
                            }
                        }
                        user.id = existingUser._id.toString();
                        (user as any).role = existingUser.role;
                    }
                    return true;
                } catch (error) {
                    console.error('Error saving Google user:', error);
                    return '/login?error=DatabaseOffline';
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token._id = user.id;
                token.role = (user as any).role || 'user';
            } else if (token?._id && token.role === 'user') {
                // If the user's current role is 'user', check if they've been promoted to 'admin'
                // This allows live session updates without forcing logout/login
                try {
                    const dbUser = await User.findById(token._id);
                    if (dbUser && dbUser.role === 'admin') {
                        token.role = 'admin';
                    }
                } catch (e) {
                    console.error('Error refreshing token role:', e);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in url query string as ?error=
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
