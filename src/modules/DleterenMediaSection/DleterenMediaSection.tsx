'use client';

import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { useState } from 'react';

import { GalleryCard } from '@/components/GalleryCard';

import styles from './DleterenMediaSection.module.scss';

type GalleryType = 'image' | 'video';

interface Props {
    galleries: NewsroomGallery[];
    localeCode: Locale.Code;
    /** Link to full media page */
    mediaPageUrl: string;
}

/**
 * D'leteren media section — shown on standard site homepage (Page 4).
 * Displays top 3 galleries with an Images / Videos toggle.
 */
export function DleterenMediaSection({ galleries, localeCode, mediaPageUrl }: Props) {
    const [activeType, setActiveType] = useState<GalleryType>('image');

    // Separate by gallery type; fall back to showing all if no typed ones exist
    const imageGalleries = galleries.filter(
        (g) => !g.type || g.type === 'image',
    );
    const videoGalleries = galleries.filter((g) => g.type === 'video');

    // If no video galleries exist, hide the toggle
    const showToggle = videoGalleries.length > 0;

    const displayed = (activeType === 'video' ? videoGalleries : imageGalleries).slice(0, 3);

    if (galleries.length === 0) return null;

    return (
        <section className={styles.wrapper}>
            <div className="container">
                {/* Header row: title + toggle */}
                <div className={styles.header}>
                    <h2 className={styles.heading}>Médiathèque</h2>

                    {showToggle && (
                        <div className={styles.toggle} role="group" aria-label="Type de médias">
                            <button
                                type="button"
                                className={`${styles.toggleBtn} ${activeType === 'image' ? styles.toggleBtnActive : ''}`}
                                onClick={() => setActiveType('image')}
                            >
                                Images
                            </button>
                            <button
                                type="button"
                                className={`${styles.toggleBtn} ${activeType === 'video' ? styles.toggleBtnActive : ''}`}
                                onClick={() => setActiveType('video')}
                            >
                                Vidéos
                            </button>
                        </div>
                    )}
                    {!showToggle && (
                        <div className={styles.toggle} role="group" aria-label="Type de médias">
                            <button
                                type="button"
                                className={`${styles.toggleBtn} ${styles.toggleBtnActive}`}
                            >
                                Images
                            </button>
                            <button type="button" className={styles.toggleBtn} disabled>
                                Vidéos
                            </button>
                        </div>
                    )}
                </div>

                {/* 1x3 Gallery grid */}
                {displayed.length > 0 ? (
                    <div className={styles.grid}>
                        {displayed.map((gallery) => (
                            <GalleryCard
                                key={gallery.uuid}
                                gallery={gallery}
                                localeCode={localeCode}
                                className={styles.card}
                            />
                        ))}
                    </div>
                ) : (
                    <p className={styles.empty}>Aucune galerie disponible.</p>
                )}

                {/* Link to full media page */}
                <div className={styles.footer}>
                    <a href={mediaPageUrl} className={styles.viewAll}>
                        Voir toutes les galeries
                    </a>
                </div>
            </div>
        </section>
    );
}
