import type { SVGProps } from 'react';

/**
 * D'leteren wordmark logo.
 * White "D'leteren" text with a small cyan play-triangle as the accent above the apostrophe.
 * Works on both dark (boilerplate) and image (hero) backgrounds.
 */
export function DleterenLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 160 48"
            role="img"
            aria-label="D'leteren"
            className={className}
            {...props}
        >
            {/* Cyan play-triangle accent – sits above the apostrophe position */}
            <polygon points="21,4 28,8.5 21,13" fill="#00affe" />

            {/* D'leteren wordmark in white bold sans-serif */}
            <text
                x="0"
                y="40"
                fontFamily="Inter, Arial, sans-serif"
                fontWeight="700"
                fontSize="32"
                fill="#ffffff"
                letterSpacing="-0.5"
            >
                D
            </text>
            <text
                x="24"
                y="40"
                fontFamily="Inter, Arial, sans-serif"
                fontWeight="700"
                fontSize="32"
                fill="#ffffff"
                letterSpacing="-0.5"
            >
                leteren
            </text>
        </svg>
    );
}
