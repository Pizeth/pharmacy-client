# DataTable 2.4 migration closure audit

November 26, 2026. Client baseline `56fdbd6`. The audit traced Next.js route and layout imports, inspected table and form behavior from source, and compared the current DataTable boundaries with the archived layering branch. Route reachability reflects source wiring.

## Resource inventory

| Surface | Current implementation | Migration implication |
| --- | --- | --- |
| Admin translations, users, roles, and social providers | Feature-owned controllers call `ResourceDataTable`. TranslationKey is the certified windowing pilot. | Keep the existing controllers and opt-in policy. Admin users and roles are candidates for a second complex-resource acceptance pass. |
| HRD public documents | `PublicDocumentsTable` uses `ResourceDataTable` and its feature-owned controller. | Preserve the public route's query, attachments and presentation contracts. |
| Admin Document Tracking | `/admin/documents` renders `TrackingPage`, which already uses `ResourceDataTable`. | Leave deferred under the registration-workflow rule. |
| Protected `/fts` and the shared shell drawer | Both reach `components/fts/search.tsx`, which renders `components/fts/mrtTable.tsx`, the sole MRT import under `src`. It renders 200 generated rows. Its delete handler logs IDs, and edits open a legacy dialog. | Decide what the prototype should display before changing navigation. There is no backed CRUD contract to port from this table. The route is a profile-verification fallback, so retirement requires an explicit replacement destination. |
| `/admin-old` | The route dynamically loads `components/Admin/AdminApp.tsx`, which registers the React Admin `user` resource. Legacy user list, detail, create and edit components, providers and input helpers remain reachable. | Compare the actual legacy behaviors with `/admin/users` before retiring the route or redirecting it. |
| `/search` | Renders `AdvancedSearchPage` but still imports a legacy React Admin login component used only in a commented return. | Remove the unused import in a cleanup change after checking the route and build. |

## Dependencies and architecture

- `material-react-table` remains a direct dependency until both FTS entry points release the old renderer. Review legacy FTS components individually. Some unused-in-JSX imports still connect React Admin dialogs, inputs and helpers to the source graph.
- Removing the MRT renderer cannot retire React Admin. The root theme imports React Admin theme defaults, `/admin-old` depends on its providers and language packs, and the current login source reaches helpers with `ra-core` imports. Check actual hook use, type imports and runtime bundles before removing `react-admin`, `ra-core`, `ra-data-json-server`, `ra-i18n-polyglot`, or the React Admin language packs.
- The DataTable root barrel re-exports core, React, MUI and adapter APIs. Core imports showed no direct MUI, Refine, Next.js or resource-specific dependencies in the audited source. Users and roles use the root barrel alongside individual MUI column factories. That gives an export inventory to narrow later once callers and compatibility paths are known.
- Generic server, live and persistence contracts still have exports under the MUI subtree. Archived PR #31 proposes moving some pure contracts to core and lifecycle hooks to React. Those are useful boundary examples if a second consumer needs them. The branch is 84 commits ahead and 69 behind this baseline, with changes across 80 DataTable files. Adopt individual moves only when a specific caller benefits and compatibility can be tested.
- The audit found no confirmed renderer gap for MRT retirement. Shared selection, actions, filtering, sorting, pagination, cards, sticky header and persistence already exist. The unresolved questions concern FTS data ownership, navigation and legacy workflow parity. Document registration and mutation policy belong to the owning feature.

## Proposed sequence and gates

1. **Start with an FTS route contract audit.** Record the approved role of `/fts`, the drawer entry, search links and the profile-verification fallback. Compare the existing FTS prototype with the separate `/search` surface. A focused implementation PR can then retire the prototype or migrate its presentation to `ResourceDataTable` using the approved data contract. Verify desktop table and mobile cards, keyboard controls, empty and error states, search and existing landing routes. Exercise mutations only where the feature has an authorized API contract.
2. **Certify a second complex resource on the current stack.** Prefer admin users because the modern page already exists and its legacy counterpart exposes a clear parity comparison. Validate auth and profile gates, list and details, selection-gated actions, forms and errors, URL state, table/card continuity, and adapter behavior against the actual endpoint. Keep TranslationKey's windowing certification and pilot scope intact.
3. **Retire the legacy admin route after parity is approved.** Verify deep links, login, authorization and create/edit/detail behavior through the modern route. Audit `/api/admin` separately before removing it. Then remove proven dead imports and files and replace the active shared theme/auth dependencies in bounded changes. Verify theme modes, sign-in, localization and repository-wide typecheck, tests and production build before removing packages from the manifest and lockfile.
4. **Close the public API audit after migrations.** Keep Standard API and Refine interoperability, TanStack v9 feature-bound hooks, the shared table/card controller and MUI slots. Remove exports only after checking route, fixture and test consumers. Revisit the archived layering proposals only for boundaries demonstrated by the migrated resources.

## November 27 implementation

- PR #73 merged after the production heartbeat, explicit reconnect and session revocation checks passed.
- The protected FTS prototype was retired. Old bookmarks redirect to the protected dashboard, and the default menu omits the retired route. Search suggestions still select their result without leaving the current page. The last MRT renderer and its dependency were removed.
- The independent advanced search page no longer imports the unused legacy login component.
- Admin users is the second complex resource candidate. Its existing page and adapter tests are part of regression coverage. Signed-in parity with the legacy route and disposable acceptance remain gates for React Admin retirement.

The source comparison found that the modern Users page already supports
list, detail, create, edit and delete with permission checks. The legacy list
also shows MFA, login attempts, last login, lock state, and actor IDs. The
legacy forms offer an avatar upload and a choice of authentication method.
The modern user schemas expose neither those audit fields nor those write
operations. Confirm which legacy capabilities are still required and compare
the corresponding API contracts before redirecting legacy routes.

React Admin retirement, including `/admin-old`, is deferred. Document Tracking,
row-local subscriptions, and wider windowing rollout remain deferred.
