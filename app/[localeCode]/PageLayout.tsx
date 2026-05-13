import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { Header } from '@/modules/Header';

import styles from './layout.module.scss';

interface Props {
    localeCode: Locale.Code;
    showHero?: boolean;
    children: ReactNode;
}

export async function PageLayout({ localeCode, showHero, children }: Props) {
    return (
        <>
            <Header localeCode={localeCode} showHero={showHero} />
            <main className={styles.content}>{children}</main>
        </>
    );
}
