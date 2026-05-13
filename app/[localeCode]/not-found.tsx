import { IntlMiddleware } from '@prezly/theme-kit-nextjs/middleware';

import { app } from '@/adapters/server';
import { Header } from '@/modules/Header';
import { NotFound } from '@/modules/NotFound';

export default async function NotFoundPage() {
    const localeCode = IntlMiddleware.getLocaleCodeFromHeader() ?? (await app().defaultLocale());

    return (
        <>
            <Header localeCode={localeCode} />
            <NotFound localeCode={localeCode} />
        </>
    );
}
