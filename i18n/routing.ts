import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    // 'as-needed' means the default locale (/en) won't add a prefix,
    // but more importantly this works with our middleware to avoid leaking into /admin
    localePrefix: 'as-needed',
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

