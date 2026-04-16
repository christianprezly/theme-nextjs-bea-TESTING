import { DEFAULT_PAGE_SIZE, type Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import { app, generatePageMetadata, routing } from '@/adapters/server';
import { Contacts } from '@/modules/Contacts';
import { DleterenBreadcrumbs } from '@/modules/DleterenBreadcrumbs';
import { DleterenHero } from '@/modules/DleterenHero';
import { DleterenMediaSectionServer } from '@/modules/DleterenMediaSection';
import { DleterenStoriesHeader } from '@/modules/DleterenStoriesHeader';
import { FeaturedCategories } from '@/modules/FeaturedCategories';
import { getStoryListPageSize, parseNumber, parsePreviewSearchParams } from '@/utils';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
    }>;
    searchParams: Promise<{
        category?: string;
    }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { generateAbsoluteUrl } = await routing();

    return generatePageMetadata(
        {
            locale: params.localeCode,
            generateUrl: (locale) => generateAbsoluteUrl('index', { localeCode: locale }),
        },
        {
            alternates: {
                types: {
                    'application/rss+xml': generateAbsoluteUrl('feed'),
                },
            },
        },
    );
}

const Stories = dynamic(
    async () => {
        const component = await import('@/modules/Stories');
        return { default: component.Stories };
    },
    { ssr: true },
);

const HubStories = dynamic(
    async () => {
        const component = await import('@/modules/HubStories');
        return { default: component.HubStories };
    },
    { ssr: true },
);

export default async function StoriesIndexPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const newsroom = await app().newsroom();
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);

    return (
        <>
            {/* ── Hub homepage (Page 1 / Page 3) ── */}
            {newsroom.is_hub && (
                <DleterenHero
                    imageSrc="/images/dleteren-hero-main.jpg"
                    imageAlt="D'leteren Press Room – Informer avec rigueur"
                    withIntro
                />
            )}

            {newsroom.is_hub ? (
                <HubStories
                    layout={themeSettings.layout}
                    localeCode={params.localeCode}
                    membersDisplay={themeSettings.hub_members_display}
                    pageSize={DEFAULT_PAGE_SIZE}
                    showDate={themeSettings.show_date}
                    showSubtitle={themeSettings.show_subtitle}
                    storyCardVariant={themeSettings.story_card_variant}
                />
            ) : (
                /* ── Standard site homepage (Page 4) ── */
                <>
                    {/* Breadcrumbs: Accueil › Parent Hub › Current site */}
                    <DleterenBreadcrumbs localeCode={params.localeCode} />

                    {/* Heading left + search right */}
                    <DleterenStoriesHeader />

                    {/* Stories grid */}
                    <Stories
                        categoryId={
                            searchParams.category ? parseNumber(searchParams.category) : undefined
                        }
                        fullWidthFeaturedStory={themeSettings.full_width_featured_story}
                        layout={themeSettings.layout}
                        localeCode={params.localeCode}
                        pageSize={getStoryListPageSize(themeSettings.layout)}
                        showDate={themeSettings.show_date}
                        showSubtitle={themeSettings.show_subtitle}
                        storyCardVariant={themeSettings.story_card_variant}
                        withPageTitle={false}
                    />

                    {/* Media gallery 1×3 grid with Images/Videos toggle */}
                    <DleterenMediaSectionServer localeCode={params.localeCode} />
                </>
            )}

            <Contacts localeCode={params.localeCode} />
            {themeSettings.show_featured_categories && (
                <FeaturedCategories
                    accentColor={themeSettings.accent_color}
                    localeCode={params.localeCode}
                />
            )}
        </>
    );
}
