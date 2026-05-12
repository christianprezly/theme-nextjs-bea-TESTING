import type { Newsroom } from '@prezly/sdk';
import Image from 'next/image';

import { getUploadcareImage } from '@/utils';

import styles from './DleterenHubTile.module.scss';

/**
 * Placeholder images matched to desired brand order:
 * new&used | business services | bikes | energy | urban mobility | innovation
 */
const ORDERED_TILE_IMAGES = [
    '/images/dleteren-hub-newusedcars.jpg',
    '/images/dleteren-hub-bizservices.jpg',
    '/images/dleteren-hub-bikes.jpg',
    '/images/dleteren-hub-energy.jpg',
    '/images/dleteren-hub-urbanmobility.jpg',
    '/images/dleteren-hub-innovation.jpg',
];

/**
 * Hardcoded destination URLs, position-matched to ORDERED_TILE_IMAGES above.
 * The Prezly `newsroom.url` for each sub-hub doesn't line up with the brand
 * order we render, so we ignore it here and route by tile position instead.
 */
const ORDERED_TILE_HREFS = [
    'https://dleteren-hub-1.prezly.com/',
    'https://dleteren-hub-2.prezly.com/',
    'https://dleteren-hub-3.prezly.com/',
    'https://dleteren-hub-4.prezly.com/',
    'https://dleteren-hub-5.prezly.com/',
    'https://dleteren-hub-6.prezly.com/',
];

/**
 * Label background colors per tile position (matches brand order above).
 */
const TILE_LABEL_COLORS = ['#0d3b5d', '#00afff', '#3a5ba7', '#3ab5a7', '#e84242', '#354248'];

/**
 * Display labels per tile position. Hardcoded to guarantee the exact wording
 * regardless of what each sub-newsroom's `display_name` is set to in Prezly.
 */
const ORDERED_TILE_LABELS = [
    'NEW & USED CARS',
    'BUSINESS SERVICES',
    'BIKES',
    'ENERGY',
    'URBAN & SHARED MOBILITY',
    'INNOVATION',
];

interface Props {
    newsroom: Newsroom;
    index: number;
}

export function DleterenHubTile({ newsroom, index }: Props) {
    const { display_name } = newsroom;

    // Prefer the newsroom's own cover image via Uploadcare CDN
    const uploadcareImg =
        getUploadcareImage(newsroom.newsroom_logo) ??
        getUploadcareImage((newsroom as any).header_image);

    const placeholderSrc = ORDERED_TILE_IMAGES[index % ORDERED_TILE_IMAGES.length];
    const labelColor = TILE_LABEL_COLORS[index % TILE_LABEL_COLORS.length];
    // Position-based hardcoded link — see ORDERED_TILE_HREFS comment above.
    const tileHref = ORDERED_TILE_HREFS[index % ORDERED_TILE_HREFS.length];
    const tileLabel = ORDERED_TILE_LABELS[index % ORDERED_TILE_LABELS.length];

    return (
        <a
            href={tileHref}
            className={styles.tile}
            target="_blank"
            rel="noopener noreferrer"
            title={tileLabel}
        >
            {/* Image fills the upper portion — does NOT overlap the label */}
            <div className={styles.tileImageWrapper}>
                {uploadcareImg ? (
                    <Image
                        src={uploadcareImg.cdnUrl}
                        alt={display_name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 200px"
                        className={styles.tileImage}
                        loader={({ src, width }) => `${src}-/resize/${width}x/`}
                    />
                ) : (
                    // biome-ignore lint/performance/noImgElement: static placeholder served from /public; no width/height needed (CSS-sized via .tileImage)
                    <img
                        src={placeholderSrc}
                        alt={display_name}
                        className={styles.tileImage}
                        loading="lazy"
                    />
                )}
            </div>

            {/* Label sits below the image — never covers it */}
            <div className={styles.tileLabel} style={{ backgroundColor: labelColor }}>
                {tileLabel}
            </div>
        </a>
    );
}
