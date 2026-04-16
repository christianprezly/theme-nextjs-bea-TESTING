import type { Locale } from '@prezly/theme-kit-nextjs';

import { app, routing } from '@/adapters/server';

import { DleterenMediaSection } from './DleterenMediaSection';

interface Props {
    localeCode: Locale.Code;
}

/**
 * Server wrapper: fetches up to 6 galleries then passes them to the client DleterenMediaSection.
 */
export async function DleterenMediaSectionServer({ localeCode }: Props) {
    const { galleries } = await app().galleries({ limit: 6 });
    const { generateUrl } = await routing();
    const mediaPageUrl = generateUrl('media', { localeCode });

    if (galleries.length === 0) return null;

    return (
        <DleterenMediaSection
            galleries={galleries}
            localeCode={localeCode}
            mediaPageUrl={mediaPageUrl}
        />
    );
}
