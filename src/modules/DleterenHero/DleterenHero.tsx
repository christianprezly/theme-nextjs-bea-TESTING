import styles from './DleterenHero.module.scss';

interface Props {
    /**
     * Background image src (from /public/images/).
     * When omitted the image section is not rendered — used when the image
     * has been moved to the Header container (hub homepage).
     */
    imageSrc?: string;
    /** Alt text for the hero image */
    imageAlt?: string;
    /** Optional large title shown on hub-child pages (e.g. "New & Used Cars") */
    title?: string;
    /** Show the intro text section (hub homepage only) */
    withIntro?: boolean;
}

/**
 * D'leteren hero banner — optional full-width image + optional intro text.
 *
 * On the hub homepage the image is rendered as the Header background so
 * only withIntro={true} is needed here.
 *
 * Uses a plain <img> tag because next.config has images.loader: 'custom'
 * (Uploadcare CDN), and local /public assets don't need CDN transformation.
 */
export function DleterenHero({
    imageSrc,
    imageAlt = "D'leteren Press Room",
    title,
    withIntro = false,
}: Props) {
    const hasImage = !!imageSrc;

    return (
        <>
            {/* Full-width hero image — only when imageSrc provided */}
            {hasImage && (
                <section className={styles.hero}>
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className={styles.heroImage}
                        loading="eager"
                        fetchPriority="high"
                    />
                    {title && (
                        <>
                            <div className={styles.heroOverlay} aria-hidden />
                            <div className={styles.heroTitle}>{title}</div>
                        </>
                    )}
                </section>
            )}

            {/* Intro text — hub homepage only */}
            {withIntro && (
                <section className={styles.intro}>
                    <div className="container">
                        <div className={styles.introInner}>
                            <h1 className={styles.introHeading}>
                                Informer avec rigueur sur les enjeux de demain
                            </h1>
                            <div className={styles.introBody}>
                                <p>
                                    Parce que la mobilité est au centre du développement de notre
                                    société, D&apos;leteren a pour mission de construire une mobilité
                                    fluide et durable pour toutes et tous. Cette volonté se traduit
                                    par le développement d&apos;un écosystème de produits et de
                                    services complet, innovant et unique sur le marché.
                                </p>
                                <p>
                                    À travers nos communiqués de presse, complets, précis et
                                    fiables, nous vous proposons d&apos;explorer notre univers, de
                                    découvrir l&apos;ensemble de nos marques ainsi que la diversité
                                    de nos services, qui témoignent de notre engagement pour la
                                    mobilité de demain.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
