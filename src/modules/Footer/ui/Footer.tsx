'use client';

import type { ReactNode } from 'react';

import styles from './Footer.module.scss';

const FOOTER_LINKS = [
    { label: "D'leteren Centers", href: 'https://www.dleteren.be/centers' },
    { label: 'Vie Privée', href: 'https://www.dleteren.be/vie-privee' },
    { label: 'Mentions légales', href: 'https://www.dleteren.be/mentions-legales' },
    { label: 'The Way We Work', href: 'https://www.dleteren.be/the-way-we-work' },
    { label: 'Alerte Intégrité | LEZ', href: 'https://www.dleteren.be/alerte-integrite' },
] as const;

const COMPANY_NAME = "D'leteren Automotive SA/NV";
const COMPANY_REST =
    ' · Rue du Mail, 50 – 1050 Bruxelles – Belgique · Tel.: +32 2.536.51.11 · TVA BE 0466909993 · RPM Bruxelles';

interface Props {
    /** Cookie-consent and privacy-request links from the parent server component */
    children: ReactNode;
    isWhiteLabeled: boolean;
}

export function Footer({ children }: Props) {
    return (
        <footer className={styles.container}>
            <div className="container">
                <div className={styles.footer}>
                    <span className={styles.company}>
                        <span className={styles.companyName}>{COMPANY_NAME}</span>
                        {COMPANY_REST}
                    </span>
                    <div className={styles.links}>
                        {/* Cookie consent + data-request links from Prezly (injected as children) */}
                        {children}
                        {/* Hardcoded D'leteren footer links */}
                        {FOOTER_LINKS.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className={styles.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
