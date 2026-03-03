'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminSetup() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);

    // Check if an admin already exists — if so, setup is disabled
    useEffect(() => {
        async function checkAdminExists() {
            try {
                const res = await fetch('/api/admin/setup');
                const data = await res.json();

                if (data.adminExists) {
                    toast.info('Admin already exists. Setup is disabled.');
                    router.replace('/login');
                }
            } catch {
                toast.error('Failed to check admin status.');
            } finally {
                setChecking(false);
            }
        }

        if (status !== 'loading') {
            checkAdminExists();
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success('Success! You are now an Admin. Please logout and login again.');
            setTimeout(() => router.push('/login'), 2000);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                    <h1 className="text-2xl font-bold text-center">Admin Setup</h1>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        One-time setup to create the first admin account.
                        Enter the setup secret from your server environment variables.
                    </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Logged in as:</strong> {session?.user?.email}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        This account will be promoted to admin.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Enter setup secret"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Promote to Admin'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
