# Prezly Next.js Theme Development

All projects in this folder are Prezly-based Next.js themes — customizations of the same base web app.
These rules apply across all `theme-nextjs-*` projects.

## Skills

- Always use the **Frontend Design** skill when working on any Prezly theme customization — UI components, SCSS styling, layout changes, theming, and visual design tasks.

## Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`)
- **Styling**: SCSS — variables/mixins auto-injected globally via `prependData` in `next.config.js`
- **Linting/Formatting**: Biome (replaces ESLint + Prettier) — always generate code that passes `biome.json`
- **Package manager**: pnpm (Node 20.x required)
- **Testing**: Playwright for e2e

## Core Libraries

- `@prezly/theme-kit-nextjs` — base Next.js config and Prezly routing
- `@prezly/sdk` — Prezly API client
- `@prezly/content-renderer-react-js` — story content rendering
- `@headlessui/react` — accessible UI primitives
- `tinycolor2` — color manipulation (only use this, never manual hex math)

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm check        # biome lint + format (run before committing)
pnpm lint:fix     # biome lint --write
pnpm format:fix   # biome format --write
pnpm typecheck    # tsc --noEmit
pnpm test         # playwright e2e tests
```

## Project Structure

```
app/                    # Next.js App Router pages and API routes
  [localeCode]/         # All pages are i18n-routed
    (index)/            # Homepage
    (story)/            # Story detail pages
    category/           # Category listing pages
    media/              # Media gallery pages
  api/                  # API routes
src/
  components/           # Dumb, reusable UI components (Button, Badge, Modal...)
  modules/              # Smart, page/feature-level logic (Header, Footer, Head, Analytics...)
  adapters/             # client/ and server/ adapter pattern
  hooks/                # Custom React hooks
  icons/                # SVG icon components
  styles/
    variables/          # _breakpoints, _colors, _spacing, _typography, _border-radius, _shadows
    mixins/             # _responsive, _typography, _accessibility, _container, _images...
    styles.globals.scss
  utils/                # Utility functions
  theme-settings.ts     # Font enum, ThemeSettings interface, DEFAULT_THEME_SETTINGS
  types.ts              # Shared TypeScript types
  constants.ts          # App-wide constants
custom/                 # Project-specific overrides (mirrors src/ structure)
middleware.ts           # Next.js i18n middleware
```

## Code Style

- Use path aliases for all imports — never use relative paths going up more than one level:
  - `@/components/*`, `@/modules/*`, `@/styles/*`, `@/utils`, `@/hooks`
  - `@/types`, `@/constants`, `@/theme-settings`, `@/custom/*`
  - `@/adapters/client`, `@/adapters/server`
- SVGs are imported as React components via `@svgr/webpack`
- SCSS variables and mixins are globally available — no need to import them manually

## Responsiveness

Always adapt components for responsiveness — whether modifying an existing component or creating a new one, mobile/tablet/desktop layouts must be handled in the same pass, not as an afterthought.

**Breakpoints (standard across all projects):**
- Tablet: 768px
- Desktop: 1024px

**Always use SCSS mixins — never hardcode media queries:**
```scss
.element {
    padding: $spacing-3;           // mobile-first (no mixin = applies everywhere)

    @include tablet-up { ... }     // min-width: 768px
    @include desktop-up { ... }    // min-width: 1024px
    @include mobile-only { ... }   // max-width: 767px
    @include tablet-only { ... }   // 768px–1023px
    @include not-desktop { ... }   // max-width: 1023px
}
```

Use the `useDevice()` hook for JS-based responsive logic.

## Theming Architecture

The theming data flow is:

```
Prezly API → ThemeSettings → BrandingSettings
  → getCssVariables.ts  (pure function: settings → CSS variable object)
  → InjectCssVariables.tsx  (React component: injects <style>:root{...}</style> in head)
  → All components via var(--prezly-*)
```

**Rules:**
- All CSS color theming goes through CSS variables (`--prezly-` prefix)
- SCSS variables (`$spacing-`, `$color-`, `$font-*`) are for static design tokens only
- Use `var(--prezly-accent-color)` in `.module.scss` files, not hardcoded colors
- Use `useThemeSettings()` hook only when JS color logic is needed in a component

## getCssVariables.ts

This is a pure function (`ThemeSettings → Record<string, string>`) in `src/modules/Head/components/`.

**Color derivation rules (consistent across all projects):**
- Active state: `tinycolor2(color).darken(10)`
- Hover state: `tinycolor2(color).lighten(5)`
- Secondary text: `setAlpha(0.8)`, tertiary: `setAlpha(0.6)`
- Button text color: `isLight() ? black : white` (auto-contrast)
- All variables use `--prezly-` prefix

**Critical:** `ThemeSettingsAdapter.connect` fetches live values from Prezly's backend at runtime — these override `DEFAULT_THEME_SETTINGS`. For fork-specific hardcoded values (fonts, colors), set them directly in `getCssVariables.ts` and the related component, not in the defaults.

## Theme Settings (src/theme-settings.ts)

Contains: `Font` enum, `FONT_FAMILY` mapping, `getGoogleFontName()`, `getRelatedFont()`, `ThemeSettings` interface, `DEFAULT_THEME_SETTINGS`.

**Rules:**
- Add custom fonts to the `Font` enum — never use string literals
- `getGoogleFontName()` must return `null` for self-hosted/local fonts
- `getRelatedFont()` is used for font pairs (e.g. Alegreya → Alegreya Sans)
- `DEFAULT_THEME_SETTINGS` must be complete — no null values except `main_logo`, `main_site_label`, `main_site_url`

## Fonts

**Watch out — two things silently override font changes:**
1. **API overrides**: Live settings from Prezly's backend win over `DEFAULT_THEME_SETTINGS`. Set hardcoded fonts in `getCssVariables.ts` directly.
2. **Middleware blocking static assets**: Any font file in `public/` must be excluded from the middleware matcher (see Middleware section below).

**Google Fonts** (default approach):
- `getGoogleFontName()` returns the Google Fonts name
- `BrandingSettings` dynamically builds the Google Fonts URL with weights 400, 500, 600, 700, 900
- Add `<link rel="preconnect" href="https://fonts.googleapis.com" />` in `Preconnect.tsx`

**Self-hosted fonts** (for custom/branded fonts):
- Store files in `public/fonts/` (woff2 preferred, ttf accepted)
- Define `@font-face` in `src/styles/_fonts.scss` with `font-display: swap`
- Return `null` from `getGoogleFontName()` for that font
- Add preconnect if using Typekit: `<link rel="preconnect" href="https://use.typekit.net" />`

**SCSS rule for @font-face:**
`@use` must come first in any SCSS file — any CSS output (including `@font-face`) must go after all `@use` statements. `prependData` in `next.config.js` invisibly adds `@use` lines at the top of every file, so placing `@font-face` in a file that also has `@use` will break.

## Middleware (middleware.ts)

The middleware is standardized across all projects — do not modify the logic, only the matcher.

**Standard matcher (default):**
```ts
matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico$|sitemap\\.xml$|robots\\.txt$).*)']
```

**If you add static assets to `public/`, add exclusions to the matcher or the middleware will intercept them and return 404:**
```ts
// Example: fonts + images
matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico$|sitemap\\.xml$|robots\\.txt$|fonts/|.*\\.woff2?$|images/).*)']
```

## SCSS Architecture

- Use `@use` syntax (not `@import`) for SCSS modules
- SCSS variables are globally available via `prependData` — do not re-import them
- For project-specific custom variables: create `src/styles/variables/_custom.scss` and `@forward` it from `variables/index.scss`
- Component styles always go in `ComponentName.module.scss` (never in global SCSS)
- Mix SCSS variables (static tokens) and CSS variables (theme colors) in the same `.module.scss` file — this is correct and expected

## custom/ Folder

Used for project-specific overrides that don't belong in `src/`. Mirrors the `src/` structure.

```
custom/
  components/     # Project-specific UI components (Logo, Container, Buttons...)
  Category/       # Full page-level overrides of src/modules/
  Stories/        # StoryCard, StoriesList, InfiniteStories overrides
  Header/         # GlobalHeader override
  Footer/         # GlobalFooter override
  data.ts         # Navigation items, project-specific constants
  fns.ts          # Utility functions, translation helpers
  types.ts        # Project-specific TypeScript types
```

Export via `index.ts` barrel files. Import using `@/custom/*` alias.

## next.config.js Pattern

Wrapper chain is always: `withBundleAnalyzer → withThemeKitConfig → withSentryConfig`

Use `@use` (not `@import`) in `prependData`:
```js
const globalSassImports = `@use "src/styles/variables" as *;\n@use "src/styles/mixins" as *;\n`;
```

Sentry is only enabled in production with a DSN and not on Vercel.

## Workflow

1. Always run `pnpm check` before committing — runs lint + format together
2. Run `pnpm typecheck` to catch TypeScript issues
3. Use feature branches: `feature/description` or `fix/description`
4. Test Playwright e2e with `pnpm test` for routing and rendering changes

## Quality Gate — MANDATORY after every coding task

After completing **any** set of code changes, always run all three checks in this order before reporting done:

```bash
pnpm typecheck   # must produce zero errors
pnpm check       # biome lint + format — auto-fix with pnpm format:fix / pnpm lint:fix if needed, then re-run
pnpm build       # production build must succeed with zero errors (warnings are acceptable)
```

Do not skip any of these steps, even for small changes. Only report the task as complete once all three pass.
