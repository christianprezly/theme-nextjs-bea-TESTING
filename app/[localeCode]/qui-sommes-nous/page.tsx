import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { DleterenHero } from '@/modules/DleterenHero';

import styles from './page.module.scss';

interface Props {
    params: Promise<{ localeCode: Locale.Code }>;
}

export const metadata: Metadata = {
    title: "Qui sommes-nous ? | D'leteren Press Room",
};

// Brand sections — logo names & placeholder hrefs (1:1 match to Prezly sites TBD)
const BRAND_SECTIONS = [
    {
        heading: 'New & used cars',
        brands: [
            'Volkswagen', 'Audi', 'SEAT', 'CUPRA', 'Škoda',
            'Volkswagen Commercial Vehicles', 'Porsche', 'Bentley',
            'Lamborghini', 'Bugatti', 'Rimac', 'Maserati',
            "D'leteren Luxury Performance", 'WAY', 'Audi Approved.plus',
            "D'leteren Mobility Company", 'Wondercar', 'WonderService',
        ],
    },
    {
        heading: 'Business services',
        brands: [
            "Volkswagen D'leteren Finance", 'Joule',
            'Mobility Solutions by D\'leteren', 'mbrella',
        ],
    },
    {
        heading: 'Bikes',
        brands: ['Lucien'],
    },
    {
        heading: 'Energy',
        brands: ["D'leteren Energy"],
    },
    {
        heading: 'Urban & Shared Mobility',
        brands: ['Poppy', 'Taxis Verts', 'Husk'],
    },
    {
        heading: 'Innovation',
        brands: ['Poppy Autonomy', 'm-ero'],
    },
] as const;

export default async function QuiSommesNousPage({ params }: Props) {
    await params; // ensure params resolves

    return (
        <>
            {/* Same hero as homepage */}
            <DleterenHero
                imageSrc="/images/dleteren-hero-main.jpg"
                imageAlt="D'leteren – Qui sommes-nous"
            />

            {/* Main content */}
            <article className={styles.content}>
                <div className="container">
                    {/* Heading block */}
                    <header className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Qui sommes-nous&nbsp;?</h1>
                        <p className={styles.tagline}>Moving people forward</p>
                        <div className={styles.bodyText}>
                            <p>
                                D&apos;leteren est un acteur clé dans les changements de société liés
                                à la saine mobilité. Dans un monde en pleine mutation, nous préparons
                                l&apos;avenir. La mobilité de demain, nous la voulons fluide et
                                durable pour tous.
                            </p>
                            <p>
                                Depuis plus de 215 ans, D&apos;leteren, entreprise familiale et
                                citoyenne, s&apos;investit sans cesse dans la recherche et la mise en
                                place de solutions adaptées pour transformer la mobilité de chacun au
                                quotidien.
                            </p>
                            <p>
                                <strong>
                                    Notre architecture de marque repose sur nos 6 piliers
                                    commerciaux&nbsp;:
                                </strong>
                            </p>
                            <ul className={styles.pillars}>
                                <li>
                                    New &amp; used cars : Marques de voitures neuves et
                                    d&apos;occasion et services de vente au détail,
                                    d&apos;entretien et de réparation
                                </li>
                                <li>Business services</li>
                                <li>Bikes</li>
                                <li>Energy</li>
                                <li>Shared mobility (Mobilité partagée)</li>
                                <li>Innovation</li>
                            </ul>
                            <p>
                                Ces piliers constituent les fondements sur lesquels repose notre
                                écosystème de mobilité intégré.
                            </p>
                        </div>
                    </header>

                    {/* Brand sections */}
                    {BRAND_SECTIONS.map(({ heading, brands }) => (
                        <section key={heading} className={styles.brandSection}>
                            <h2 className={styles.sectionHeading}>{heading}</h2>
                            <div className={styles.brandGrid}>
                                {brands.map((name) => (
                                    <a key={name} href="#" className={styles.brandTile}>
                                        <span className={styles.brandName}>{name}</span>
                                    </a>
                                ))}
                            </div>
                            <hr className={styles.sectionDivider} />
                        </section>
                    ))}

                    {/* Closing paragraph */}
                    <div className={styles.closing}>
                        <p>
                            <strong>D&apos;leteren Group</strong>
                        </p>
                        <p>
                            Notre mission est de bâtir une famille d&apos;entreprises qui
                            réinventent leur industrie, en recherche d&apos;excellence et
                            d&apos;un impact significatif.
                        </p>
                        <p>
                            Plus d&apos;informations au sujet du Groupe D&apos;leteren:{' '}
                            <a
                                href="https://www.dleterengroup.com/fr/"
                                className={styles.closingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://www.dleterengroup.com/fr/
                            </a>
                        </p>
                    </div>
                </div>
            </article>
        </>
    );
}
