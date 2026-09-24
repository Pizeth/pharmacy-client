# Translation table browser acceptance — 2026-09-24

Target: https://local-hr.razeth.com/admin/i18n

Status: core TranslationValue CRUD browser flow passed; full acceptance matrix incomplete.
The served build commit was not established. These results describe the live site,
not a verified repository revision.

## Passed

- Signed-in translation page renders 31 keys and English/Khmer values.
- Global search for auth_email returns one matching key; detail expansion and collapse work.
- auth_email shows both supported locales and disables Add translation.
- Edit opens the correct English value, disables Save initially, enables it after a draft change,
  and ignores Escape. Closing discards the unsaved draft.
- Delete identifies the correct key, locale, and value; Cancel receives initial focus.
  Escape and backdrop clicks retain the dialog; Cancel dismisses it.
- sequence_test initially has zero translations and an enabled Add translation command.
- Empty Create submission displays validation errors and retains the form.
- Created English value `Browser acceptance 2026-09-24` on sequence_test (key 31).
  Success alert and refreshed row confirmed creation.
- Edited that value to `Browser acceptance 2026-09-24 edited`.
  Refreshed row and subsequent Delete dialog confirmed the saved value.
- With explicit user confirmation, deleted only that English test translation.
  While pending, X, Cancel, and Delete were disabled and a loading indicator appeared.
  Success alert and reopened details confirmed zero translations and the empty state.
- Search remained sequence_test through mutations.
- All ten headers measured 36px high with the same rgb(38, 40, 43) background.
- Pagination label, selected size, and range shared the same y coordinate and 28px height.
- Page size 10 rendered ten data rows; Next displayed 11–20 of 31; Last displayed
  31–31 of 31 and disabled Next/Last.
- Fullscreen entered and exited; the table and pinned Actions were visible in the captured view.
- No console errors were captured. A logo image warning about its parent's static positioning was present.

## Findings

- Successful mutation refreshes collapse the expanded detail panel. Review whether expansion
  should persist; no claim is made that the current behavior violates an established requirement.
- Empty locale validation exposes a raw regex message rather than a friendly required-field prompt.
- /dashboard shows the application Not Found page; /admin/i18n works.

## Remaining coverage

Not verified: failed mutation/retry behavior, duplicate-submit network counts, request bodies/session
headers, pending controls for Create/Edit, preservation of combined sorting/filtering/page state,
RTL, light mode, a full responsive viewport matrix, and exact MRT hover parity.

## Cleanup

The temporary English translation was deleted and sequence_test again has zero values.
The auth_email edit was never submitted. Restored the table to empty global search,
page 1, page size 25, and fullscreen off. No production source changes were made by this test.
