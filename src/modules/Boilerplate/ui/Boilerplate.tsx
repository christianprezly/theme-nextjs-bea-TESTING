import type { Newsroom, NewsroomCompanyInformation } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';

import { DleterenLogo } from '@/icons/DleterenLogo';

import { getWebsiteHostname } from '../utils';

import styles from './Boilerplate.module.scss';

interface Props {
    localeCode: Locale.Code;
    newsroom: Pick<Newsroom, 'display_name'>;
    companyInformation: NewsroomCompanyInformation;
}

/** D'leteren custom boilerplate — dark navy, 4 hardcoded columns + backend contact */
export function Boilerplate({ companyInformation }: Props) {
    const hasEmail = Boolean(companyInformation.email);
    const hasWebsite = Boolean(companyInformation.website);
    const hasAddress = Boolean(companyInformation.address);

    return (
        <section className={styles.container}>
            <div className="container">
                {/* Logo */}
                <DleterenLogo className={styles.logo} aria-label="D'leteren" />

                {/* 4 link columns */}
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
                                <li key={name}>
                                    <a href="#" className={styles.link}>{name}</a>
                                </li>
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
                                <li key={name}>
                                    <a href="#" className={styles.link}>{name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Nos services aux entreprises */}
                    <div className={styles.col}>
                        <h3 className={styles.colHeading}>Nos services<br />aux entreprises</h3>
                        <ul className={styles.linkList}>
                            {[
                                "D'leteren Energy", 'Mobility Solutions by D\'leteren',
                                'Location long terme', 'Leasing Financier', 'Renting Financier',
                                'E-Moby', 'Lizy', 'Skipr', 'MyMove', 'Mbrella',
                                'Ush', 'Husk', 'Mobvious Pro', 'Joule',
                            ].map((name) => (
                                <li key={name}>
                                    <a href="#" className={styles.link}>{name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Notre vision + Contact (from backend) */}
                    <div className={styles.col}>
                        <h3 className={styles.colHeading}>Notre vision</h3>
                        <ul className={styles.linkList}>
                            {[
                                'Notre vision 2025', 'Nos engagements',
                                "À propos du groupe D'leteren", 'Chiffres & résultats',
                            ].map((name) => (
                                <li key={name}>
                                    <a href="#" className={styles.link}>{name}</a>
                                </li>
                            ))}
                        </ul>

                        {/* Contact — from newsroom backend settings */}
                        <h3 className={styles.colHeading} style={{ marginTop: '2rem' }}>Contact</h3>
                        <address className={styles.address}>
                            {hasAddress && (
                                <p>{companyInformation.address}</p>
                            )}
                            {!hasAddress && (
                                <p>Rue du Mail 50 · 1050 Brussels · Belgium</p>
                            )}
                            {hasEmail && (
                                <a
                                    href={`mailto:${companyInformation.email}`}
                                    className={styles.link}
                                >
                                    {companyInformation.email}
                                </a>
                            )}
                            {!hasEmail && (
                                <a href="mailto:jean-marc.ponteville@dleteren.be" className={styles.link}>
                                    jean-marc.ponteville@dleteren.be
                                </a>
                            )}
                            {hasWebsite && (
                                <a
                                    href={companyInformation.website}
                                    className={styles.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {getWebsiteHostname(companyInformation.website)}
                                </a>
                            )}
                            {!hasWebsite && (
                                <a
                                    href="https://www.dleteren.be"
                                    className={styles.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    www.dleteren.be
                                </a>
                            )}
                        </address>
                    </div>
                </div>

                {/* Divider */}
                <hr className={styles.divider} />

                {/* Copyright row */}
                <div className={styles.copyright}>
                    <p>
                        <strong>À propos de D&apos;leteren Automotive NV/SA</strong>
                    </p>
                    <p>Copyright: textes et photos libres de droits pour utilisation rédactionnelle.</p>
                    <p>Toute autre utilisation des textes et des photos n&apos;est pas autorisée</p>
                </div>
            </div>
        </section>
    );
}
