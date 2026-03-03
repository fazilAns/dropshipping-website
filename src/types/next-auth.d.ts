import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            _id: string;
            role: string;
        } & DefaultSession['user'];
    }

    interface User {
        role: string;
        _id: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id: string;
        role: string;
    }
}
