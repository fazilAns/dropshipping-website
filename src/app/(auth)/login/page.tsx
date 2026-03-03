import AuthForm from '@/components/auth/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Dropship Store',
    description: 'Login to your account',
};

export default function LoginPage() {
    return <AuthForm mode="login" />;
}
