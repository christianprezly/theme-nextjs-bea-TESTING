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
 * Label background colors per tile position (matches brand order above).
 */
const TILE_LABEL_COLORS = [
    '#0d3b5d',
    '#00afff',
    '#3a5ba7',
    '#3ab5a7',
    '#e84242',
    '#354248',
];

interface Props {
    newsroom: Newsroom;
    index: number;
}

export function DleterenHubTile({ newsroom, index }: Props) {
    const { display_name, url } = newsroom;

    // Prefer the newsroom's own cover image via Uploadcare CDN
    const uploadcareImg =
        getUploadcareImage(newsroom.newsroom_logo) ??
        getUploadcareImage((newsroom as any).header_image);

    const placeholderSrc = ORDERED_TILE_IMAGES[index % ORDERED_TILE_IMAGES.length];
    const labelColor = TILE_LABEL_COLORS[index % TILE_LABEL_COLORS.length];

    return (
        <a
            href={url}
            className={styles.tile}
            target="_blank"
            rel="noopener noreferrer"
            title={display_name}
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
                    <img
                        src={placeholderSrc}
                        alt={display_name}
                        className={styles.tileImage}
                        loading="lazy"
                    />
                )}
            </div>

            {/* Label sits below the image — never covers it */}
            <div
                className={styles.tileLabel}
                style={{ backgroundColor: labelColor }}
            >
                {display_name}
            </div>
        </a>
    );
}
