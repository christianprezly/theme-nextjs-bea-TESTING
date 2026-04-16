'use client';

import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import { useCallback } from 'react';

import { http, useLocale } from '@/adapters/client';
import type { ThemeSettings } from '@/theme-settings';
import type { ListStory } from '@/types';

import { StoriesList } from '../InfiniteStories';

import { DleterenHubTile } from './DleterenHubTile';
import { DleterenSearch } from './DleterenSearch';

import styles from './InfiniteHubStories.module.scss';

type Props = {
    initialStories: ListStory[];
    layout: ThemeSettings['layout'];
    newsroomName: string;
    newsroomUuid: string;
    newsrooms: Newsroom[];
    pageSize: number;
    showDate: boolean;
    showSubtitle: boolean;
    storyCardVariant: ThemeSettings['story_card_variant'];
    total: number;
};

function fetchStories(props: { localeCode: Locale.Code; offset: number; limit: number }) {
    const { localeCode, offset, limit } = props;
    return http.get<{ data: ListStory[]; total: number }>('/api/hub-stories', {
        limit,
        offset,
        locale: localeCode,
    });
}

export function InfiniteHubStories({
    initialStories,
    layout,
    newsroomName,
    newsroomUuid,
    newsrooms,
    pageSize,
    showDate,
    showSubtitle,
    storyCardVariant,
    total,
}: Props) {
    const locale = useLocale();
    const includedNewsrooms = newsrooms.filter(({ uuid }) => uuid !== newsroomUuid);

    const {
        load,
        loading,
        data: stories,
        done,
    } = useInfiniteLoading(
        useCallback(
            (offset) =>
                fetchStories({
                    localeCode: locale,
                    offset,
                    limit: pageSize,
                }),
            [locale, pageSize],
        ),
        { data: initialStories, total },
    );

    return (
        <div className={styles.wrapper}>
            {/* ── Hub member tiles ── */}
            {includedNewsrooms.length > 0 && (
                <div className={styles.newsrooms}>
                    {includedNewsrooms.map((newsroom, index) => (
                        <DleterenHubTile key={newsroom.uuid} newsroom={newsroom} index={index} />
                    ))}
                </div>
            )}

            {/* ── Centered search bar ── */}
            <div className={styles.searchRow}>
                <DleterenSearch />
            </div>

            {/* ── Stories grid ── */}
            <div className="container">
                <h2 className={styles.storiesHeading}>Derniers articles</h2>
            </div>
            <StoriesList
                fullWidthFeaturedStory={false}
                isCategoryList
                layout={layout}
                newsroomName={newsroomName}
                newsrooms={newsrooms}
                newsroomUuid={newsroomUuid}
                showDate={showDate}
                showSubtitle={showSubtitle}
                stories={stories}
                storyCardVariant={storyCardVariant}
                withEmptyState={false}
                withPageTitle={false}
            />

            {/* ── Load more CTA ── */}
            {!done && (
                <div className={styles.loadMore}>
                    <button
                        type="button"
                        className={styles.ctaButton}
                        onClick={load}
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : "Découvrez d'autres articles"}
                    </button>
                </div>
            )}
        </div>
    );
}
