import type { ExtendedStory, Story as StoryType } from '@prezly/sdk';
import type { DocumentNode } from '@prezly/story-content-format';
import { ImageNode } from '@prezly/story-content-format';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { FormattedDate } from '@/adapters/client';
import { app } from '@/adapters/server';
import { CategoriesList } from '@/components/CategoriesList';
import { ContentRenderer } from '@/components/ContentRenderer';
import { getRenderableSocialSharingNetworks, SocialShare } from '@/components/SocialShare';
import type { StoryActions, ThemeSettings } from '@/theme-settings';

import { Embargo } from './Embargo';
import { HeaderImageRenderer } from './HeaderImageRenderer';
import { HeaderRenderer } from './HeaderRenderer';
import { RelatedStories } from './RelatedStories';
import { Share } from './Share';
import type { SharingOptions } from './type';

import styles from './Story.module.scss';

type Props = {
    showDate: ThemeSettings['show_date'];
    story: ExtendedStory;
    relatedStories: StoryType[];
    withHeaderImage: ThemeSettings['header_image_placement'];
    sharingOptions: SharingOptions;
    actions: StoryActions;
    locale: Locale.Code;
    withBadges: boolean;
};

export async function Story({
    actions,
    locale,
    relatedStories,
    sharingOptions,
    showDate,
    story,
    withBadges,
    withHeaderImage,
}: Props) {
    const {
        links,
        visibility,
        thumbnail_url: thumbnailUrl,
        title,
        slug,
        uuid,
        uploadcare_assets_group_uuid,
    } = story;
    const nodes = JSON.parse(story.content);
    const [headerImageDocument, mainDocument] = pullHeaderImageNode(nodes, withHeaderImage);
    const sharingText = story.social_text || story.title;
    const sharingUrl = links.short || links.newsroom_view;
    const sharingSocialNetworks = getRenderableSocialSharingNetworks(
        sharingOptions.sharing_actions,
        { thumbnailUrl, visibility },
    );

    const categories = await app().translatedCategories(story.culture.code, story.categories);

    return (
        <div className={styles.container}>
            <article className={styles.story}>
                <Embargo story={story} />
                {withHeaderImage === 'above' && headerImageDocument && (
                    <HeaderImageRenderer nodes={headerImageDocument} />
                )}
                {/* D'leteren meta bar: date | categories | social share — all on one line */}
                <div className={styles.metaBar}>
                    {showDate && story.published_at && (
                        <p className={styles.date}>
                            <FormattedDate value={story.published_at} />
                        </p>
                    )}
                    {categories.length > 0 && showDate && story.published_at && (
                        <span className={styles.metaDivider} aria-hidden>|</span>
                    )}
                    {categories.length > 0 && (
                        <CategoriesList
                            categories={categories}
                            external={false}
                            showAllCategories
                            withBadges={withBadges}
                        />
                    )}
                    {((showDate && Boolean(story.published_at)) || categories.length > 0) &&
                        sharingOptions.sharing_placement.includes('top') && (
                        <span className={styles.metaDivider} aria-hidden>|</span>
                    )}
                    {sharingOptions.sharing_placement.includes('top') && (
                        <SocialShare
                            socialNetworks={sharingSocialNetworks}
                            url={sharingUrl}
                            text={sharingText}
                            uuid={uuid}
                            thumbnailUrl={thumbnailUrl}
                            trackingContext="Story Page Header"
                        />
                    )}
                </div>
                <HeaderRenderer nodes={mainDocument} />
                <ContentRenderer story={story} nodes={mainDocument} />
            </article>
            {sharingOptions.sharing_placement.includes('bottom') && (
                <Share
                    actions={actions}
                    thumbnailUrl={thumbnailUrl}
                    socialNetworks={sharingSocialNetworks}
                    slug={slug}
                    title={title}
                    text={sharingText}
                    uploadcareAssetsGroupUuid={uploadcare_assets_group_uuid}
                    url={sharingUrl}
                    uuid={uuid}
                />
            )}
            {relatedStories.length > 0 && (
                <RelatedStories locale={locale} stories={relatedStories} />
            )}
        </div>
    );
}

function pullHeaderImageNode(
    documentNode: DocumentNode,
    withHeaderImage: ThemeSettings['header_image_placement'],
): [DocumentNode | null, DocumentNode] {
    const { children } = documentNode;
    const [firstNode] = children;

    if (ImageNode.isImageNode(firstNode) && withHeaderImage === 'above') {
        return [
            { ...documentNode, children: [firstNode] },
            { ...documentNode, children: children.slice(1) },
        ];
    }

    return [null, documentNode];
}
