# Authentication components

The Next.js `/login` route renders `Auth` through Refine's `AuthPage`.

- `auth.tsx`: theme defaults and page composition; public compound slots remain compatible.
- `components/AuthFormPanel.tsx`: avatar, theme toggle, mode transition and feedback.
- `components/AuthBackground.tsx`: decorative effects and astronaut.
- `components/RegisterFields.tsx`: registration and confirmation fields under FormProvider.
- `hooks/useAuthSession.ts`: session check, safe destination, One Tap and mode state.
- `hooks/useAuthForm.ts`: shared validation, CAPTCHA state and Refine mutations.
- `ui/authForm.tsx`: accessible form composition and existing public form slots.
- `styles/`: named MUI slots; retain existing `RazethAuth` and `RazethAuthForm` theme keys.
- `LoginFeedback` / `AuthErrorNotice`: shared toast and desktop inline failure behavior.
- `unused/`: preserved legacy login variants, experiments and unused effects. Do not import these into the active login. `login.tsx` and `signUpForm.tsx` remain compatibility entry points for the older React Admin flow; it is not yet retired.

Keep application theme files. Moving historical components is not permission to remove theme registrations.
Preserve auth-provider contracts, redirect validation, One Tap guards, CAPTCHA and async registration validation when changing presentation.
