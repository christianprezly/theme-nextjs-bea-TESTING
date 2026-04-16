import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { app } from '@/adapters/server';

import styles from './DleterenBreadcrumbs.module.scss';

interface Props {
    localeCode: Locale.Code;
    /** Optional extra crumb at the end (e.g. story title) */
    currentLabel?: string;
}

/**
 * D'leteren breadcrumb bar — shown on standard (non-hub) site pages.
 * Layout: [Newsroom logo] | Accueil › [Parent hub label] › [Current site]
 * Optionally appends a fourth crumb for story pages.
 */
export async function DleterenBreadcrumbs({ localeCode, currentLabel }: Props) {
    const newsroom = await app().newsroom();
    const settings = await app().themeSettings();
    const languageSettings = await app().languageOrDefault(localeCode);

    const siteName =
        languageSettings.company_information.name || newsroom.name || newsroom.display_name;

    // Parent hub breadcrumb (from theme settings main_site_*)
    const parentLabel = settings.main_site_label;
    const parentUrl = settings.main_site_url;

    // Newsroom logo
    const logoUrl = getLogoUrl(newsroom);

    return (
        <section className={styles.wrapper}>
            <div className="container">
                <div className={styles.inner}>
                    {/* Site logo */}
                    {logoUrl && (
                        <a href={parentUrl ?? '/'} className={styles.logoLink}>
                            {/* Plain img — logo may be Uploadcare URL or plain URL; avoids loader requirement */}
                            <img
                                src={logoUrl}
                                alt={siteName}
                                className={styles.logo}
                                loading="lazy"
                            />
                        </a>
                    )}

                    {/* Breadcrumb trail */}
                    <nav aria-label="Fil d'Ariane" className={styles.breadcrumbs}>
                        <ol className={styles.list}>
                            {/* Home crumb */}
                            <li className={styles.crumb}>
                                <a href={parentUrl ?? '/'} className={styles.crumbLink}>
                                    Accueil
                                </a>
                            </li>

                            {/* Parent hub crumb */}
                            {parentLabel && (
                                <>
                                    <li className={styles.separator} aria-hidden>
                                        ›
                                    </li>
                                    <li className={styles.crumb}>
                                        <a href={parentUrl ?? '#'} className={styles.crumbLink}>
                                            {parentLabel}
                                        </a>
                                    </li>
                                </>
                            )}

                            {/* Current site crumb */}
                            <li className={styles.separator} aria-hidden>
                                ›
                            </li>
                            <li className={styles.crumb}>
                                {currentLabel ? (
                                    <a href="/" className={styles.crumbLink}>
                                        {siteName}
                                    </a>
                                ) : (
                                    <span className={styles.crumbCurrent}>{siteName}</span>
                                )}
                            </li>

                            {/* Optional story crumb */}
                            {currentLabel && (
                                <>
                                    <li className={styles.separator} aria-hidden>
                                        ›
                                    </li>
                                    <li className={styles.crumb}>
                                        <span className={styles.crumbCurrent}>{currentLabel}</span>
                                    </li>
                                </>
                            )}
                        </ol>
                    </nav>
                </div>
            </div>
        </section>
    );
}

function getLogoUrl(newsroom: Newsroom): string | null {
    const logo = newsroom.newsroom_logo as
        | { original_url?: string; cdn_url?: string; cdnUrl?: string }
        | null
        | undefined;
    if (!logo) return null;
    return logo.cdn_url ?? logo.cdnUrl ?? logo.original_url ?? null;
}
