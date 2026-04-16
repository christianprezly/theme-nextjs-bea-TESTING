import type { Locale } from '@prezly/theme-kit-nextjs';
import { notFound } from 'next/navigation';

import { app, generateStoryPageMetadata } from '@/adapters/server';
import { DleterenBreadcrumbs } from '@/modules/DleterenBreadcrumbs';
import { DleterenMediaSectionServer } from '@/modules/DleterenMediaSection';
import { Story } from '@/modules/Story';
import { parsePreviewSearchParams } from '@/utils';

import { Broadcast } from '../components';

interface Props {
    params: Promise<{
        localeCode: Locale.Code;
        slug: string;
    }>;
    searchParams: Promise<Record<string, string>>;
}

async function resolve(params: Props['params']) {
    const { localeCode, slug } = await params;

    const story = await app().story({ slug });
    if (!story) notFound();

    const { stories: relatedStories } = await app().stories({
        limit: 3,
        locale: localeCode,
        query: JSON.stringify({ slug: { $ne: slug } }),
    });

    return { relatedStories, story };
}

export async function generateMetadata({ params }: Props) {
    const { story } = await resolve(params);

    return generateStoryPageMetadata({ story });
}

export default async function StoryPage(props: Props) {
    const { localeCode } = await props.params;
    const searchParams = await props.searchParams;
    const { story, relatedStories } = await resolve(props.params);
    const settings = await app().themeSettings();
    const themeSettings = parsePreviewSearchParams(searchParams, settings);
    const newsroom = await app().newsroom();

    return (
        <>
            <Broadcast story={story} />

            {/* Breadcrumbs: Accueil › Parent Hub › Site › Story title — only on non-hub sites */}
            {!newsroom.is_hub && (
                <DleterenBreadcrumbs
                    localeCode={localeCode}
                    currentLabel={story.title}
                />
            )}

            <Story
                story={story}
                showDate={themeSettings.show_date}
                withHeaderImage={themeSettings.header_image_placement}
                relatedStories={themeSettings.show_read_more ? relatedStories : []}
                actions={{
                    show_copy_content: themeSettings.show_copy_content,
                    show_copy_url: themeSettings.show_copy_url,
                    show_download_assets: themeSettings.show_download_assets,
                    show_download_pdf: themeSettings.show_download_pdf,
                }}
                sharingOptions={{
                    sharing_placement: themeSettings.sharing_placement,
                    sharing_actions: themeSettings.sharing_actions,
                }}
                withBadges={themeSettings.story_card_variant === 'boxed'}
                locale={localeCode}
            />

            {/* Media gallery section — same as standard site homepage (Page 4) */}
            {!newsroom.is_hub && (
                <DleterenMediaSectionServer localeCode={localeCode} />
            )}

            {/* Back to parent site CTA */}
            {!newsroom.is_hub && themeSettings.main_site_url && (
                <DleterenBackCta
                    href={themeSettings.main_site_url}
                    label={themeSettings.main_site_label ?? 'Retour'}
                />
            )}
        </>
    );
}

/** Simple inline "back to hub" CTA — no external file needed */
function DleterenBackCta({ href, label }: { href: string; label: string }) {
    return (
        <div
            style={{
                textAlign: 'center',
                padding: '2.5rem 0 3.5rem',
                background: '#fff',
            }}
        >
            <a
                href={href}
                style={{
                    display: 'inline-block',
                    padding: '0.75rem 2.5rem',
                    borderRadius: '100px',
                    background: '#00affe',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                }}
            >
                ← {label}
            </a>
        </div>
    );
}
