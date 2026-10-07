<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Application presentation and feature organization

Read `docs/hrd-architecture.md` before changing HRD or its former Link feature.
Follow `src/features/i18n/translation-keys` for feature ownership and
`PublicDocumentsTable.tsx` / `styles/styled.ts` for MUI slot registration.
Use named, typed styled slots and theme rules for permanent presentation.
Do not add CSS modules or local `sx` unless runtime geometry makes it unavoidable.
Preserve the theme's font variables, background switch, shared content width,
and full-width footer.
