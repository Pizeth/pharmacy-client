# HRD feature architecture

HRD follows the feature organization in `src/features/i18n/translation-keys`
and the slot/theme-first contract in `docs/datatable-roadmap.md`,
`docs/datatable-shell-theme-6f1.md`, and `docs/datatable-theme-defaults-6f2.md`.

## Ownership

- `src/app/(app)/(sub)/hrd`: route entry points and metadata only.
- `src/features/hrd/pages`: home, about, and contact presentation and their tests.
- `documents/table`: table composition, table configuration, and table hooks.
- `documents/columns`: resource columns and cell renderers.
- `documents/components`: document-specific presentation such as file badges.
- `documents/data`: document records and categories.
- `documents/actions`: opening, viewing, and downloading documents.
- `documents/utils`: pure document-format helpers.
- `components/layout`: shared site layout, content width, and breadcrumbs.
- `components/footer`: the full-width footer.
- `data`: HRD identity, approved/pending about content, and homepage highlights.
- `types`: feature contracts; no renderer implementation.
- `utils`: pure shared contact-link helpers.
- `styles`: typed slot registration helpers and slot keys.

Tests stay beside the behavior they verify. Each feature boundary exposes an
`index.ts`; internal implementations use direct imports to avoid pulling in
unrelated pages. Do not create API, schema, or transport layers until the feature
actually needs them. Resource-specific rules stay out of the generic DataTable.

## Presentation contract

Use named MUI styled components, following `PublicDocumentsTable.tsx` and its
`publicDocumentsSlot()` helper. HRD pages use `hrdSlot()` under
`theme.components.RazethHrd.styleOverrides`. Existing document and footer slots
retain `RazethPublicDocuments` so their theme identity is preserved.

The page `.styles.tsx` files contain styled component definitions, not CSS
modules. They use `theme.vars` (with the ordinary palette fallback), theme
breakpoints, and named slots. JSX renders those components directly. Do not
introduce CSS modules or permanent inline `sx`; reserve inline styles for truly
unavoidable runtime geometry. Put variants on semantic data attributes rather
than composing ad hoc classes. Keep typography on MUI variants so the theme's
CSS font variables remain authoritative.

Register new slot keys in `styles/hrdSlotKeys.ts` and `src/theme.d.ts` so theme
overrides are typed. Do not add theme defaultProps without a corresponding
`useThemeProps` consumer, and do not put resource data into theme defaults.

The shared layout owns `--Hrd-page-background`, its light/dark switch, and the
readable content surface. The content uses the theme's `xl` width. Breadcrumbs
are rendered once by the shared layout; pages must not duplicate them. The
footer stays outside the constrained content wrapper. Preserve app-bar colors,
desktop hover menus, inline drawer expansion, and close-on-navigation behavior.

## Verification

Run the HRD feature tests and TypeScript checks after structural changes.
Verify desktop and narrow layouts, light/dark contrast, breadcrumbs, document
actions, and navigation in the browser when presentation changes. Add focused
tests proving slot overrides remain usable from the theme.
