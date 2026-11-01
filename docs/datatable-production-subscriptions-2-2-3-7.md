# DataTable 2.2.3.7 — production subscription boundaries

## Architecture decision before implementation

Base: `54b8d0257a63e7db0461555fb445ac4c943926d8`, fetched master.
Branch: `codex/datatable-production-subscriptions`.
Baseline reproduction: 3 suites / 37 tests pass, including the historical
D1–D26 and N1–N16 proofs and unsafe narrowed-owner counterexamples.

The installed TanStack React Table 9.3.1 `useTable` returns a wrapper whose
`state` is its selector result. `createTableHook` publishes that exact wrapper
through a stable `AppTable` component using `useSyncExternalStore`. A narrower
owner therefore cannot supply the complete legacy callback snapshot. Reading
the core store does not repair this API contract. No adapter, cloned state,
proxy table, second store or public locality declaration will be introduced.

| Boundary | Authority / invalidation |
| --- | --- |
| Resource owner | Full `useMuiDataTable` snapshot; controlled props and external atoms remain authoritative |
| AppTable | Genuine hook wrapper; context broadcasts on owner/options changes |
| Body | Model, expansion, pinning and column selectors, plus owner propagation |
| Row | Whole selection and row pinning; diagnostic narrowing remains diagnostic only |
| Cell | AppCell column geometry plus inherited owner/row changes; arbitrary callbacks stay broad |
| Native detail | Mounted before expansion/content omission; needs independent broad callback invocation before deciding whether to create tr/td |
| Card list | Final display model and broad selection; retains present list behavior |
| Card item | Proposed mounted broad invocation boundary before header/body/metadata/actions/selection/expansion/detail decisions |
| Flip | Existing hover/expanded/revealed state and focus/inert semantics; preserve its lazy first reveal and mounted back face |
| External inputs | Ordinary React props/context; never ignored by a custom comparator or cached ref snapshot |

The bounded production change will integrate invocation boundaries for physical
nullable detail rows and per-card composition. Unknown callbacks remain broad.
Empty fragments retain the existing renderable-content contract; only null,
undefined and false omit native detail rows/optional card slots. Zero and empty
strings remain renderable. Collapsed native/inline details remain uninvoked.

The full-state owner and context fan-out are not solved by these boundaries.
Expected decision is **B**, unless subsequent evidence establishes a safe public
opt-in. No density profiling is warranted without that correctness gate; no
virtualization is included. Historical reports and negative probes stay intact.

## Implemented boundary and compatibility limits

`DataTableCallbackBoundary` reads the genuine feature-bound context and broadly
subscribes before invoking its renderer. Native detail owns the complete physical
row decision inside it. Card list/model ownership stays unchanged; extracted
`DataTableCardItem` owns broad callback invocation before all slot decisions.
This is a per-card composition boundary, **not independent local subscriptions
for each card slot**. Selection paint still uses the authoritative row API.
Existing nullish fallback controls, compact-body fallback, flip first-reveal,
focus transfer, inert faces, class names and theme slots are preserved.

The historical D19 live-store nullable callback now passes through the actual
native row boundary. Its assertion is promoted to positive DOM acceptance only
for that fixed case. D6/D21 narrowed-snapshot counterexamples remain negative.
No callback signature, dependency declaration, transport or resource policy changes.

Installed versions: Next16.4.3, React19.3.1, MUI7.3.11, TanStack9.3.1,
TypeScript compatibility API6.0.3 and native compiler7.0.2.

## Current correctness evidence

- Baseline: 3 suites /37 tests passed before edits.
- Focused physical/card/dependency acceptance: 4 suites /59 tests passed before
  the final two local-parent regressions and production-variant matrix extension.
- Final focused physical + dependency contracts: 2 suites /40 tests passed.
- Typecheck including the generated feature audit passes.
- New production DOM tests cover null/undefined/false omission, fragment/zero/
  empty-string compatibility, colspan, expansion accessibility, external policy,
  Strict Mode, remount/unmount, custom/default slots, controlled/unloaded IDs,
  flip focus/inert and table/card continuity.
- Native and card detail independently become populated beneath an explicit
  internal row-local parent which records **zero commits** for B-only selection.
  Callbacks receive the current genuine hook wrapper, verified by identity.
  This is a low-level boundary acceptance test, not a public optimized owner.
- Existing committed-output assertions extended to the production fixture retain
  broad owner/body1/1, row IDs a,b and14 physical cells after B; local own-output
  A skips while global and nested A commit once. No timing thresholds are added.

## Browser evidence so far

Windows IAB Chrome156, development, localhost:8080,1280×720. The public
asus-hr.razeth.com fixture still showed the old option list after reload; its
rendering is not presented as evidence of this checkout. Localhost visibly
exposes the new raw production option. No application server was restarted.

- Raw production callback, A expanded at zero: zero physical detail rows/two
  data rows. Keyboard Space selects B only: native A detail is inserted under
  tbody, one spanning td with colspan7, count1; A itself remains unselected.
- Select A too: global A2, aggregate guard disabled, exactly one detail row.
  Data rows A281.875–322.875 and B343.890625–384.890625, both41px;
  separate detail lies between them, with no overlap in this observed case.
- Same-instance card switch retains a,b and every raw header/body snapshot/
  metadata/selection/expansion/detail count2. External policy removes physical
  inline detail and keeps the action disabled.
- Flip before selection then select A/B: detail2, front inert, back visible.
  Back-to-front keyboard activation returns focus to Show details; back is inert.
  RTL retains selected identities and live callbacks. No fixture warnings/errors.
- [Settled desktop RTL flip](evidence/datatable-production-2-2-3-7/desktop-rtl-flip.png).
- Viewport override was attempted but actual DOM width remained1265px with
  environment1280×720. It was reset. **No narrow/mobile acceptance is claimed.**
- Current-source localhost admin resources require sign-in; browser verification
  is pending. The older Refine Document proof no longer owns `/admin/documents`:
  that route now belongs to tracked documents. Do not reuse its historical browser
  certification as current acceptance or invent selection controls there.

## Rollout decision

**B — production invocation boundaries integrated; row-local rollout deferred.**
The full-state owner and AppTable context still broadcast. A safe production
row-local opt-in is not exposed. S6/C2 locality remains internal scoped evidence,
not a public guarantee. Browser resource/narrow checks and public owner narrowing
remain incomplete. The expensive density matrix is skipped because there is no
correctness-approved optimized candidate. No production performance success or
virtualization approval follows from this phase.

Next 2.2.3.8 is conditional: first establish a compatible full-context owner with
bounded output dependencies and complete browser acceptance, then compare ordinary
production and profiling builds. Keep historical timings unchanged.

Full strict-install/test results, resource regressions, final code SHA and PR/CI
review status will be appended after the final validation run.
