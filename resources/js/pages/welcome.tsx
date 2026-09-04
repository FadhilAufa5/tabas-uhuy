import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { dashboard, login } from '@/routes';
import type { User } from '@/types';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;

    useEffect(() => {
        if (auth?.user) {
            router.visit(dashboard().url);
        } else {
            router.visit(login().url);
        }
    }, [auth]);

    return null;
}
