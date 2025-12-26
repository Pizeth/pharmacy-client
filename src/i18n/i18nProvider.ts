import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import fr from "ra-language-french";
import jp from "@bicstone/ra-language-japanese";
import { resolveBrowserLocale } from "react-admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages: { [key: string]: any } = {
  en: {
    ...englishMessages,
    razeth: {
      title: {
        welcome: "Welcome Back",
        description: "By clicking continue, you agree to our",
        agree_to: "I agree to the",
        terms_of_service: "Terms of Service",
        privacy_policy: "Privacy Policy",
        ampersand: "and",
        copyright: "Copyright © 2025 Razeth Inc. All rights reserved.",
      },
      auth: {
        // welcome: "Welcome Back",
        credentail: "Username or Email",
        username: "Username",
        email: "Email",
        password: "Password",
        re_password: "Re-enter Password",

        sign_in: "Sign In",
        sign_out: "Sign Out",
        sign_up: "Sign up",
        remember_me: "Remember me",
        forgot_password: "Forgot your password?",
        sign_in_error: "Authentication failed, please try again!",
        sign_up_error: "Registration failed, please try again!",
        sign_in_success: "Successfully signed in!",
        signup_success: "Account created successfully! Please sign in.",
        forgot_password_success:
          "Password reset instructions have been sent to your email.",
        reset_password: "Reset Password",
        reset_password_success: "Your password has been successfully reset.",
        oidc_error: "Failed to initiate login. Please try again!",
        social_login: "Or continue with",
        no_account: "Don't have an account?",
        not_authenticated: "You are not authenticated.",
      },
      validation: {
        required: "%{field} is required!",
        notmatch: "The password do not match!",
        unique: "%{field} %{value} is already existed!",
        username:
          "%{field} %{value} is not allowed! Ensure it Starts with a letter Is 5-50 characters long Only uses letters, numbers, _, or ., No consecutive __ or ..",
        password: "Your password does not meet the required criteria!",
        async: "An error occurred while validating the %{field}!",
        validating: "Validating...",
        error: "",
      },
      feedback: {
        password:
          "Password must be at least 10 characters, include uppercase, lowercase, number, and special character!",
        weak: "Password is too weak!",
      },
      footer: {
        // description: "By clicking continue, you agree to our",
        // termsOfService: "Terms of Service",
        // privacyPolicy: "Privacy Policy",
        // agree_to: "I agree to the",
        // terms: "Terms of Service",
        // and: "and",
        // privacy: "Privacy Policy",
        // ampersand: "and",
        // copyright: "Copyright © 2025 Razeth Inc. All rights reserved.",
      },
    },
    // "razeth.validation.required": "%{field} is required!",
    // "razeth.validation.notmatch": "The passwords do not match!",

    // ra: {
    //   validation: {
    //     // ...englishMessages,
    //     required: "%{field} is required!", // Add the translation
    //     unique: "Value %{value} is already used for %{field}",
    //     maxValue: "%{max} is higher than %{value}",
    //   },
    // },
  },
  jp: {
    ...jp,
  },
  fr: {
    ...fr,
  },
};

// export const i18nProvider = polyglotI18nProvider(
//   (locale) => (messages[locale] ? messages[locale] : messages.en),
//   resolveBrowserLocale(),
//   [
//     { locale: "en", name: "English" },
//     { locale: "fr", name: "Français" },
//     { locale: "jp", name: "日本語" },
//   ],
// );

export const i18nProvider = polyglotI18nProvider(
  (locale) => messages[locale] || messages.en,
  // (locale) => {
  //   const messagesForLocale = messages[locale] || messages.en;
  //   console.log("Loaded messages:", messagesForLocale); // Debugging
  //   return messagesForLocale;
  // },
  // (locale) => {
  //   const finalMessages = {
  //     ...(messages[locale] || messages.en),
  //     // Add fallback for missing translations
  //     "razeth.validation.notmatch":
  //       messages[locale]?.["razeth.validation.notmatch"] ||
  //       "Password mismatch (fallback)",
  //   };
  //   // console.log("Active translations:", finalMessages);
  //   return finalMessages;
  // },
  resolveBrowserLocale(),
  [
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
    { locale: "jp", name: "日本語" },
  ]
);
