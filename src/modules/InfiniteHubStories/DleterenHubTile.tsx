import type { Newsroom } from '@prezly/sdk';
import Image from 'next/image';

import { getUploadcareImage } from '@/utils';

import styles from './DleterenHubTile.module.scss';

/**
 * Ordered placeholder images for D'leteren hub tiles (from /public/images/).
 * These are assigned by position (order of newsrooms returned from the API).
 */
const ORDERED_TILE_IMAGES = [
    '/images/dleteren-hub-newusedcars.jpg',
    '/images/dleteren-hub-bizservices.jpg',
    '/images/dleteren-hub-bikes.jpg',
    '/images/dleteren-hub-energy.jpg',
    '/images/dleteren-hub-urbanmobility.jpg',
    '/images/dleteren-hub-innovation.jpg',
];

interface Props {
    newsroom: Newsroom;
    index: number;
}

export function DleterenHubTile({ newsroom, index }: Props) {
    const { display_name, url } = newsroom;

    // Prefer the newsroom's own cover image; fall back to ordered placeholder
    const uploadcareImg =
        getUploadcareImage(newsroom.newsroom_logo) ??
        getUploadcareImage((newsroom as any).header_image);

    const placeholderSrc = ORDERED_TILE_IMAGES[index % ORDERED_TILE_IMAGES.length];

    return (
        <a
            href={url}
            className={styles.tile}
            target="_blank"
            rel="noopener noreferrer"
            title={display_name}
        >
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
                <>
                    <div className={styles.tilePlaceholder} />
                    <Image
                        src={placeholderSrc}
                        alt={display_name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 200px"
                        className={styles.tileImage}
                    />
                </>
            )}
            <div className={styles.tileLabel}>{display_name}</div>
        </a>
    );
}
