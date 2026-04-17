import type { Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { DleterenLogo } from '@/icons';

import { getWebsiteHostname } from '../utils';

import styles from './Boilerplate.module.scss';

interface Props {
    localeCode: Locale.Code;
    newsroom: Pick<Newsroom, 'display_name'>;
    companyInformation: NewsroomCompanyInformation;
}

/** D'leteren custom boilerplate — dark navy, 4 hardcoded upper columns + 2-col lower section */
export function Boilerplate({ companyInformation }: Props) {
    const hasEmail = Boolean(companyInformation.email);
    const hasAddress = Boolean(companyInformation.address);
    const hasWebsite = Boolean(companyInformation.website);

    return (
        <section className={styles.container}>
            <div className="container">
                {/* Logo */}
                <DleterenLogo className={styles.logo} aria-label="D'leteren" />

                {/* ── Upper: 4 link columns ── */}
                <div className={styles.columns}>
                    {/* Col 1 — Nos marques */}
                    <div className={styles.col}>
                        <h3 className={styles.colHeading}>Nos marques</h3>
                        <ul className={styles.linkList}>
                            {[
                                'Volkswagen', 'Audi', 'SEAT', 'CUPRA', 'Škoda',
                                'Volkswagen Commercial Vehicles', 'Porsche', 'Bentley',
                                'Lamborghini', 'Bugatti', 'Rimac', 'Micro', 'Lucien',
                            ].map((name) => (
                                <li key={name}><a href="#" className={styles.link}>{name}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 2 — Nos services aux particuliers */}
                    <div className={styles.col}>
                        <h3 className={styles.colHeading}>Nos services<br />aux particuliers</h3>
                        <ul className={styles.linkList}>
                            {[
                                'Financement Classique', 'AutoCredit', 'Private Lease',
                                'weCare', 'Assurances pour particuliers', 'weCover',
                                'Audi Approved.plus', 'My Way', 'Wondercar', 'Poppy',
                                'Mobvious', 'Taxi verts', 'My Way Buy', 'Poppy Lease',
                            ].map((name) => (
                                <li key={name}><a href="#" className={styles.link}>{name}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Nos services aux entreprises */}
                    <div className={styles.col}>
                        <h3 className={styles.colHeading}>Nos services<br />aux entreprises</h3>
                        <ul className={styles.linkList}>
                            {[
                                "D'leteren Energy", "Mobility Solutions by D'leteren",
                                'Location long terme', 'Leasing Financier', 'Renting Financier',
                                'E-Moby', 'Lizy', 'Skipr', 'MyMove', 'Mbrella',
                                'Ush', 'Husk', 'Mobvious Pro', 'Joule',
                            ].map((name) => (
                                <li key={name}><a href="#" className={styles.link}>{name}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Notre vision */}
                    <div className={styles.col}>
                        <h3 className={styles.colHeading}>Notre vision</h3>
                        <ul className={styles.linkList}>
                            {[
                                'Notre vision 2025', 'Nos engagements',
                                "À propos du groupe D'leteren", 'Chiffres & résultats',
                            ].map((name) => (
                                <li key={name}><a href="#" className={styles.link}>{name}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Lower section: À propos (left) + Contact (right) ── */}
                <div className={styles.lower}>
                    {/* Left — À propos */}
                    <div className={styles.lowerLeft}>
                        <p className={styles.lowerHeading}>
                            <strong>À propos de D&apos;leteren Automotive NV/SA</strong>
                        </p>
                        <p className={styles.lowerText}>
                            Copyright: textes et photos libres de droits pour utilisation rédactionnelle.
                        </p>
                        <p className={styles.lowerText}>
                            Toute autre utilisation des textes et des photos n&apos;est pas autorisée.
                        </p>
                    </div>

                    {/* Right — Contact (from newsroom backend settings) */}
                    <address className={styles.contact}>
                        <p className={styles.contactHeading}>Contact</p>
                        <p className={styles.contactLine}>
                            {hasAddress ? companyInformation.address : 'Rue du Mail 50 · 1050 Brussels · Belgium'}
                        </p>
                        <a
                            href={`mailto:${hasEmail ? companyInformation.email : 'jean-marc.ponteville@dleteren.be'}`}
                            className={styles.contactLink}
                        >
                            {hasEmail ? companyInformation.email : 'jean-marc.ponteville@dleteren.be'}
                        </a>
                        <a
                            href={hasWebsite ? companyInformation.website : 'https://www.dleteren.be'}
                            className={styles.contactLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {hasWebsite ? getWebsiteHostname(companyInformation.website) : 'www.dleteren.be'}
                        </a>
                    </address>
                </div>
            </div>
        </section>
    );
}
