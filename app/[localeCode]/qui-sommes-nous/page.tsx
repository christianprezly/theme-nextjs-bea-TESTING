import type { Newsroom } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import type { Metadata } from 'next';

import { app } from '@/adapters/server';
import { getUploadcareImage } from '@/utils';

import styles from './page.module.scss';

interface Props {
    params: Promise<{ localeCode: Locale.Code }>;
}

export const metadata: Metadata = {
    title: "Qui sommes-nous ? | D'leteren Press Room",
};

// Same brand-keyword sort used by DleterenHubTile so section order matches the homepage tiles:
// new&used → business services → bikes → energy → urban mobility → innovation
const BRAND_ORDER = ['new', 'business', 'bik', 'energ', 'urban', 'innov'];

function brandSortIndex(name: string): number {
    const lower = name.toLowerCase();
    const idx = BRAND_ORDER.findIndex((k) => lower.includes(k));
    return idx === -1 ? BRAND_ORDER.length : idx;
}

async function getMembers(hubUuid: string): Promise<Newsroom[]> {
    const members = await app().client.newsroomHub.list(hubUuid);
    return members.map((m) => m.newsroom);
}

export default async function QuiSommesNousPage({ params }: Props) {
    await params; // ensure params resolves

    const newsroom = await app().newsroom();

    // Top-level sub-hubs (the 6 brand pillars), only if the current newsroom is itself a hub.
    const subHubs = newsroom.is_hub ? await getMembers(newsroom.uuid) : [];

    // Sort sub-hubs into desired display order, then fetch each sub-hub's own members in parallel.
    const orderedSubHubs = [...subHubs].sort(
        (a, b) => brandSortIndex(a.display_name) - brandSortIndex(b.display_name),
    );

    const sections = await Promise.all(
        orderedSubHubs.map(async (subHub) => ({
            subHub,
            sites: subHub.is_hub ? await getMembers(subHub.uuid) : [],
        })),
    );

    return (
        <>
            {/* Main content */}
            <article className={styles.content}>
                <div className="container">
                    {/* Heading block */}
                    <header className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Qui sommes-nous&nbsp;?</h1>
                        <div className={styles.bodyText}>
                            <p>Moving people forward</p>
                            <p>
                                D&apos;leteren est un acteur clé dans les changements de société
                                liés à la saine mobilité. Dans un monde en pleine mutation, nous
                                préparons l&apos;avenir. La mobilité de demain, nous la voulons
                                fluide et durable pour tous.
                            </p>
                            <p>
                                Depuis plus de 215 ans, D&apos;leteren, entreprise familiale et
                                citoyenne, s&apos;investit sans cesse dans la recherche et la mise
                                en place de solutions adaptées pour transformer la mobilité de
                                chacun au quotidien.
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
                                    d&apos;occasion et services de vente au détail, d&apos;entretien
                                    et de réparation
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

                    {/* Brand sections — populated live from this hub's sub-hubs */}
                    {sections.map(({ subHub, sites }) => (
                        <section key={subHub.uuid} className={styles.brandSection}>
                            <h2 className={styles.sectionHeading}>{subHub.display_name}</h2>
                            <div className={styles.brandGrid}>
                                {sites.map((site) => {
                                    // Server Component: build the resized Uploadcare URL via the SDK
                                    // so it splices operations into the correct URL position, then
                                    // render a plain <img>. (next/image and UploadcareImage both
                                    // require a function loader, which can't cross the RSC boundary.)
                                    const logo =
                                        getUploadcareImage(site.square_logo)?.format('auto') ??
                                        getUploadcareImage(site.newsroom_logo)?.format('auto');
                                    const logoSrc = logo?.resize(400, null).cdnUrl ?? null;
                                    const tileContent = logoSrc ? (
                                        /* biome-ignore lint/performance/noImgElement: server component cannot pass next/image loader fn across the RSC boundary */
                                        <img
                                            src={logoSrc}
                                            alt={site.display_name}
                                            className={styles.brandLogo}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className={styles.brandName}>
                                            {site.display_name}
                                        </span>
                                    );

                                    return site.url ? (
                                        <a
                                            key={site.uuid}
                                            href={site.url}
                                            className={styles.brandTile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={site.display_name}
                                        >
                                            {tileContent}
                                        </a>
                                    ) : (
                                        <div
                                            key={site.uuid}
                                            className={styles.brandTile}
                                            title={site.display_name}
                                        >
                                            {tileContent}
                                        </div>
                                    );
                                })}
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
                            réinventent leur industrie, en recherche d&apos;excellence et d&apos;un
                            impact significatif.
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
