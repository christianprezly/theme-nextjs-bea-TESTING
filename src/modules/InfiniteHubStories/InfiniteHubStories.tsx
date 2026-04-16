'use client';

import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { useInfiniteLoading } from '@prezly/theme-kit-nextjs';
import { useCallback } from 'react';

import { http, useLocale } from '@/adapters/client';
import type { ThemeSettings } from '@/theme-settings';
import type { ListStory } from '@/types';

import { StoriesList } from '../InfiniteStories';

import { DleterenBrandDropdown } from './DleterenBrandDropdown';
import { DleterenHubTile } from './DleterenHubTile';
import { DleterenSearch } from './DleterenSearch';

import styles from './InfiniteHubStories.module.scss';

type Props = {
    initialStories: ListStory[];
    layout: ThemeSettings['layout'];
    /** Controls how member newsrooms are presented: 6-tile grid or brand dropdown */
    membersDisplay: ThemeSettings['hub_members_display'];
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
    membersDisplay,
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
            {/* ── Hub member navigation: tiles grid (Page 1) or brand dropdown (Page 3) ── */}
            {includedNewsrooms.length > 0 && membersDisplay === 'tiles' && (
                <div className={styles.newsrooms}>
                    {includedNewsrooms.map((newsroom, index) => (
                        <DleterenHubTile key={newsroom.uuid} newsroom={newsroom} index={index} />
                    ))}
                </div>
            )}
            {includedNewsrooms.length > 0 && membersDisplay === 'dropdown' && (
                <DleterenBrandDropdown newsrooms={includedNewsrooms} hubUuid={newsroomUuid} />
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
