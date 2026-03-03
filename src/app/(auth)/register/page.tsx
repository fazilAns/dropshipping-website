import AuthForm from '@/components/auth/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register | Dropship Store',
    description: 'Create a new account',
};

export default function RegisterPage() {
    return <AuthForm mode="register" />;
}
