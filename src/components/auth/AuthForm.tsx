'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

interface AuthFormProps {
    mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'register') {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                toast.success('Registration successful! Please login.');
                router.push('/login');
            } else {
                const res = await signIn('credentials', {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });

                if (res?.error) {
                    throw new Error(res.error);
                }

                toast.success('Logged in successfully!');
                router.refresh();
                router.push('/admin'); // Redirect to admin by default for now, or check role
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl"
        >
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-gray-500">
                    {mode === 'login'
                        ? 'Enter your credentials to access your account'
                        : 'Enter your information to create an account'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                    ) : mode === 'login' ? (
                        'Sign In'
                    ) : (
                        'Sign Up'
                    )}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
            </div>

            <Button
                variant="outline"
                type="button"
                disabled={isGoogleLoading || loading}
                className="w-full border border-gray-300 hover:bg-gray-50"
                onClick={() => {
                    setIsGoogleLoading(true);
                    signIn('google', { callbackUrl: '/admin' });
                }}
            >
                {isGoogleLoading ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"
                    />
                ) : (
                    <svg
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                    </svg>
                )}
                {isGoogleLoading ? 'Connecting...' : 'Google'}
            </Button>

            <div className="text-center text-sm">
                {mode === 'login' ? (
                    <>
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="underline hover:text-gray-800">
                            Sign up
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <Link href="/login" className="underline hover:text-gray-800">
                            Sign in
                        </Link>
                    </>
                )}
            </div>
        </motion.div>
    );
}
