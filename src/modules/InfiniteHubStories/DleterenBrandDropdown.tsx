'use client';

import type { Newsroom } from '@prezly/sdk';

import styles from './DleterenBrandDropdown.module.scss';

interface Props {
    newsrooms: Newsroom[];
    /** UUID of the hub itself — reserved for future "All brands" link */
    hubUuid?: string;
}

/**
 * D'leteren brand dropdown — shown on sub-hub pages (Page 3).
 * Replaces the tile grid with a styled <select> to navigate between member newsrooms.
 */
export function DleterenBrandDropdown({ newsrooms, hubUuid }: Props) {
    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const url = e.target.value;
        if (url) {
            window.location.href = url;
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className="container">
                <div className={styles.inner}>
                    <label className={styles.label} htmlFor="dlt-brand-select">
                        Choisissez l&apos;une de nos marques
                    </label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="dlt-brand-select"
                            className={styles.select}
                            defaultValue=""
                            onChange={handleChange}
                            aria-label="Choisissez une marque"
                        >
                            <option value="" disabled>
                                Toutes nos marques
                            </option>
                            {newsrooms.map((newsroom) => (
                                <option key={newsroom.uuid} value={newsroom.url}>
                                    {newsroom.display_name}
                                </option>
                            ))}
                        </select>
                        {/* Custom chevron icon */}
                        <span className={styles.chevron} aria-hidden>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width="16"
                                height="16"
                            >
                                <polyline points="4,7 10,13 16,7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
