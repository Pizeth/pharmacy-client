# TranslationKey 7.2 acceptance

Date: 2026-09-21

Status: PASS. Automated verification and live browser acceptance completed.
7.2 is complete. Delete/confirmation work has not started.

## Fix

`useTranslationKeyDataTable.ts` supplied only `end` in initial column pinning.
The installed TanStack v9 type requires both logical sides. Added `start: []`:

```ts
initialState:
  rowActions.length > 0
    ? {
        columnPinning: {
          start: [],
          end: [DATA_TABLE_ACTIONS_COLUMN_ID],
        },
      }
    : undefined,
```

No generic DataTable infrastructure or new `sx` was added by this fix.
Existing row-action menu `sx` blocks predate this change.

The live browser also exposed an application layout issue: the outer main flex
item expanded to the table's intrinsic width (1905px in a 1256px viewport),
placing the pinned action outside the viewport. Added `minWidth: 0` beside
`flexGrow: 1` in `src/components/Navigations/DrawerAppBar.tsx`'s existing styled
Main component. The document then measured 1241px, fitting the viewport, and
horizontal scrolling belonged to the table container. No DataTable infrastructure
was added. Typecheck was rerun after this CSS correction and passed.

## Verification, executed in requested order

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `dataTableClasses.spec.ts` | PASS, 25 tests |
| `rowActionsTheme.spec.tsx` | PASS, 1 test |
| `rowActionsRtl.spec.tsx` | PASS, 1 test |
| `TranslationKeyCreateForm.spec.tsx` | PASS, 4 tests |
| `TranslationKeyEditForm.spec.tsx` | PASS, 4 tests |
| `translationKeyColumns.spec.tsx` | PASS, 11 tests |
| `npm run test:datatable -- --runInBand` | PASS, 214 tests / 40 suites |
| `git diff --check` | PASS; line-ending notices only |

All individual suites used `npm test -- <path> --runInBand`.

Final recovery verification: a redundant typecheck attempt ran out of Node memory.
After interruption, `.next/dev/types/routes.d.ts` and `validator.ts` contained
malformed generated output. Removed only those generated files and ran the
installed Next.js `typegen` command. Final `npm run typecheck` passed on the
restored production source. No temporary RTL or menu overrides remain.

Console observations outside this acceptance matrix: category selects emitted
out-of-range warnings while options loaded, and the app emitted existing login
Controller and logo-position warnings. Functional acceptance does not claim a
warning-free application console.

## Live browser gate

Verified the real `/admin/i18n` route after user sign-in:

| Requested checks | Result and evidence |
| --- | --- |
| 1-4: logical-end pinning, LTR/RTL and horizontal scroll | PASS after application flex correction. LTR `right: 0px`; RTL `left: 0px`, x=40px through scrollLeft=-664. Edit stayed visible. |
| 5-6: correct row and existing values | PASS: row 8 opened auth_email, Email field label, category auth. |
| 7-8: initial disabled Save and dirty enablement | PASS: changing description enabled Save. |
| 9-10: backdrop and Escape | PASS: both retained the dialog. |
| 11-12: deliberate close | PASS: X and Close dismissed idle dialogs. |
| 13: pending close controls | PASS: both X and Close were disabled during a real PATCH. |
| 14: failed request retains draft | PASS: changing sequence_test to existing auth_email produced the server duplicate-key error, retained auth_email in the draft, and kept the dialog open. Closed without changing the record. |
| 15,17: successful PATCH and refreshed metadata | PASS: temporary sequence_test description appeared after refresh and the dialog closed. |
| 16: query state preserved | PASS: descending Key sort, search `_`, Key contains `_`, page size 10, and page 2 of 4 survived a successful update. |
| 18: keyboard focus | PASS: inline Edit had a 2px outline. Overflow trigger had a 2px outline; focused Edit menu item had Mui-focusVisible and rgba(255,255,255,0.12) background. |
| 19: dark-mode pinning | PASS: pinned cell remained opaque, measured rgb(49,54,59), while scrolling in both directions. |
| 20: no new sx | PASS: source audit. |

RTL used a user-approved temporary local ThemeProvider and DOM direction wrapper
around the existing TranslationKeyTable. Menu verification temporarily set the
existing resource action column's maxInlineActions to zero. Both overrides were
removed afterward; production LTR and inline Edit were verified restored.

The test record was id 31, sequence_test. Its original key, category and description
(`Sequence stability test`) are restored. Successful PATCH checks advanced its
updatedAt timestamp as expected; no records were created or deleted.

Source audit: no new `sx` in the changed DataTable/resource diff or new edit form/dialog/shell files.

7.2 is closed with the live results above recorded. The next slice is the
resource-owned TranslationKey delete/confirmation command using the existing
typed row-action boundary.
