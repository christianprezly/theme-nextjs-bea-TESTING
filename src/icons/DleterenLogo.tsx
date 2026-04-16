import type { SVGProps } from 'react';

/**
 * D'leteren wordmark logo — white bold text + cyan play-triangle accent.
 * viewBox 160×36 keeps the SVG cap-height flush with surrounding text/elements.
 * display:block on the SVG root removes the inline baseline gap.
 */
export function DleterenLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 160 36"
            role="img"
            aria-label="D'leteren"
            className={className}
            style={{ display: 'block', overflow: 'visible', ...(props.style ?? {}) }}
            {...props}
        >
            {/* "D" */}
            <text
                x="0"
                y="28"
                fontFamily="Inter, Arial, sans-serif"
                fontWeight="800"
                fontSize="30"
                fill="#ffffff"
            >
                D
            </text>
            {/* Cyan play-triangle at the apostrophe position */}
            <polygon points="17,2 23,6 17,10" fill="#00affe" />
            {/* "leteren" */}
            <text
                x="24"
                y="28"
                fontFamily="Inter, Arial, sans-serif"
                fontWeight="800"
                fontSize="30"
                fill="#ffffff"
            >
                leteren
            </text>
        </svg>
    );
}
