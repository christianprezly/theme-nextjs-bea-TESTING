'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';

import styles from './DleterenSearch.module.scss';

/**
 * D'leteren custom search bar — centered, with search icon on the right.
 * On submit, navigates to /search?query=...
 */
export function DleterenSearch() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query.trim())}`);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} role="search">
            <div className={styles.inputWrapper}>
                <input
                    type="search"
                    className={styles.input}
                    placeholder="Rechercher"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Rechercher des articles"
                />
                <button type="submit" className={styles.searchBtn} aria-label="Lancer la recherche">
                    <SearchIcon />
                </button>
            </div>
        </form>
    );
}

function SearchIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
            aria-hidden
        >
            <circle cx="8.5" cy="8.5" r="5.75" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" />
        </svg>
    );
}
