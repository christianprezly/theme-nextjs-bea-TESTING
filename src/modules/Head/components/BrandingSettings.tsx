import { DEFAULT_THEME_SETTINGS, type ThemeSettings } from '@/theme-settings';
import { withoutUndefined } from '@/utils';

import { getCssVariables } from './getCssVariables';
import { InjectCssVariables } from './InjectCssVariables';

interface Props {
    settings: Partial<ThemeSettings>;
}

export function BrandingSettings({ settings }: Props) {
    const compiledSettings: ThemeSettings = {
        ...DEFAULT_THEME_SETTINGS,
        ...withoutUndefined(settings),
    };

    // D'Ieteren theme: Mier A is self-hosted via @font-face in src/styles/_fonts.scss
    // and the --prezly-font-family CSS vars are pinned to it in styles.globals.scss,
    // so no Google Fonts <link> needed.
    return <InjectCssVariables variables={getCssVariables(compiledSettings)} />;
}
