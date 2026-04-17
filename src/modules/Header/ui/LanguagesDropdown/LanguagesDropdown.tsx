'use client';

import { ACTIONS } from '@prezly/analytics-nextjs';
import type { Locale } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';

import { Dropdown, DropdownItem } from '@/components/Dropdown';
import { analytics } from '@/utils';

import styles from './LanguagesDropdown.module.scss';

export function LanguagesDropdown({
    selected,
    options,
    buttonClassName,
    navigationItemClassName,
}: LanguagesDropdown.Props) {
    const selectedOption = options.find((option) => option.code === selected);

    const displayedOptions = [...options].sort((a, b) => a.title.localeCompare(b.title));

    // Derive 2-letter code (e.g. "fr-BE" → "FR") for the badge label
    const badgeLabel = selected ? selected.split('-')[0].toUpperCase() : selectedOption?.title;

    return (
        <li className={navigationItemClassName}>
            <Dropdown
                label={badgeLabel}
                menuClassName={styles.menu}
                buttonClassName={classNames(buttonClassName, styles.button)}
                withMobileDisplay
            >
                {displayedOptions.map(({ code, href, title }) => (
                    <DropdownItem
                        key={code}
                        href={href}
                        withMobileDisplay
                        className={classNames({
                            [styles.disabled]: code === selected,
                        })}
                        onClick={() => analytics.track(ACTIONS.SWITCH_LANGUAGE, { code })}
                    >
                        {title}
                    </DropdownItem>
                ))}
            </Dropdown>
        </li>
    );
}

export namespace LanguagesDropdown {
    export interface Option {
        code: Locale.Code;
        title: string;
        href: string;
    }

    export interface Props {
        selected?: Option['code'];
        options: Option[];
        buttonClassName?: string;
        navigationItemClassName?: string;
    }
}
