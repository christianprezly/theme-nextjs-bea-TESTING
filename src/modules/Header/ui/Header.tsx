'use client';

import type {
    Category,
    Newsroom,
    NewsroomCompanyInformation,
    TranslatedCategory,
} from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { useMeasure } from '@react-hookz/web';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { useDevice } from '@/hooks';
import { DleterenLogo, IconClose, IconMenu } from '@/icons';
import type { ThemeSettings } from '@/theme-settings';
import type { SearchSettings } from '@/types';

import styles from './Header.module.scss';

// Hardcoded D'leteren navigation links
const DLETEREN_NAV = [
    { label: 'Accueil', href: '/', external: false },
    { label: 'Qui sommes-nous', href: '/qui-sommes-nous', external: false },
    { label: "D'leteren.be", href: 'https://www.dleteren.be', external: true },
] as const;

interface Props {
    localeCode: Locale.Code;
    newsroom: Newsroom;
    information: NewsroomCompanyInformation;
    categories: Category[];
    translatedCategories: TranslatedCategory[];
    searchSettings?: SearchSettings;
    children?: ReactNode; // language switcher
    displayedGalleries: number;
    displayedLanguages: number;
    categoriesLayout: ThemeSettings['categories_layout'];
    logoSize: ThemeSettings['logo_size'];
    mainSiteUrl: string | null;
    mainSiteLabel: string | null;
    newsrooms: Newsroom[];
}

export function Header({ localeCode, displayedLanguages, children }: Props) {
    const { isMobile } = useDevice();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [, headerRef] = useMeasure<HTMLElement>();

    function alignMobileHeader() {
        if (!isMobile) return;
        const header = headerRef.current;
        const headerRect = header?.getBoundingClientRect();
        if (headerRect && headerRect.top !== 0) {
            window.scrollBy({ top: headerRect.top });
        }
    }

    function toggleMenu() {
        alignMobileHeader();
        setTimeout(() => setIsMenuOpen((o) => !o));
    }

    useEffect(() => {
        document.body.classList.toggle(styles.body, isMenuOpen);
        return () => {
            document.body.classList.remove(styles.body);
        };
    }, [isMenuOpen]);

    return (
        <header ref={headerRef} className={styles.container}>
            <div className="container">
                <nav className={styles.header}>
                    {/* Brand: D'leteren logo + | Press Room */}
                    <Link
                        href={{ routeName: 'index', params: { localeCode } }}
                        className={styles.brand}
                    >
                        <DleterenLogo className={styles.brandLogo} />
                        <span className={styles.brandSeparator} aria-hidden />
                        <span className={styles.brandSub}>Press Room</span>
                    </Link>

                    <div className={styles.navigationWrapper}>
                        {/* Mobile hamburger */}
                        <Button
                            variation="navigation"
                            icon={isMenuOpen ? IconClose : IconMenu}
                            className={styles.navigationToggle}
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-controls="dlt-menu"
                            aria-label="Menu"
                        />

                        <div
                            className={classNames(styles.navigation, {
                                [styles.open]: isMenuOpen,
                            })}
                        >
                            <div
                                role="none"
                                className={styles.backdrop}
                                onClick={() => setIsMenuOpen(false)}
                            />
                            {/* biome-ignore lint/correctness/useUniqueElementIds: Header rendered once */}
                            <ul id="dlt-menu" className={styles.navigationInner}>
                                {DLETEREN_NAV.map(({ label, href, external }) => (
                                    <li key={label} className={styles.navigationItem}>
                                        <a
                                            href={href}
                                            className={styles.navigationButton}
                                            target={external ? '_blank' : undefined}
                                            rel={external ? 'noopener noreferrer' : undefined}
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Language selector — styled as cyan badge */}
                        <div className={styles.languageWrapper}>
                            {displayedLanguages > 1 ? (
                                children
                            ) : (
                                <span className={styles.languageBadge}>FR</span>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}
