import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ReactNode } from 'react';

import { PageLayout } from '../PageLayout';

interface Props {
    params: Promise<{ localeCode: Locale.Code }>;
    children: ReactNode;
}

export default async function CategoryLayout(props: Props) {
    const { localeCode } = await props.params;
    return <PageLayout localeCode={localeCode}>{props.children}</PageLayout>;
}
