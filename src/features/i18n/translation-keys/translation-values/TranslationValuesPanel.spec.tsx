// import { render, screen } from "@testing-library/react";
// import type { TranslationKey } from "../schemas";
// import { TranslationKeyTranslationsPanel } from "./TranslationValuesPanel";

// const record: TranslationKey = {
//   id: 11,
//   key: "auth_login",
//   description: "Login action",
//   categoryId: 2,
//   createdAt: "2026-09-03T10:00:00.000Z",
//   updatedAt: "2026-09-04T10:00:00.000Z",
//   translationCategory: {
//     id: 2,
//     name: "auth",
//     description: null,
//   },

//   translations: [
//     {
//       id: 101,
//       keyId: 11,
//       locale: "en",
//       value: "Login",
//       createdAt: "2026-09-03T10:00:00.000Z",
//       updatedAt: "2026-09-04T10:00:00.000Z",
//     },

//     {
//       id: 102,
//       keyId: 11,
//       locale: "km",
//       value: "ចូលប្រើប្រាស់",
//       createdAt: "2026-09-03T10:00:00.000Z",
//       updatedAt: "2026-09-04T10:00:00.000Z",
//     },
//   ],
// };

// describe("TranslationValuesPanel", () => {
//   it("renders the canonical nested translations from the TranslationKey row", () => {
//     const { container } = render(
//       <TranslationKeyTranslationsPanel record={record} />,
//     );

//     expect(
//       container.querySelector('[data-translation-key-id="11"]'),
//     ).not.toBeNull();

//     expect(
//       screen.getByRole("heading", {
//         name: "Translations · auth_login",
//       }),
//     ).toBeInTheDocument();

//     expect(screen.getByText("2 translation values")).toBeInTheDocument();

//     expect(screen.getByText("EN")).toBeInTheDocument();

//     expect(screen.getByText("Login")).toBeInTheDocument();

//     expect(screen.getByText("KM")).toBeInTheDocument();

//     expect(screen.getByText("ចូលប្រើប្រាស់")).toBeInTheDocument();

//     expect(
//       container.querySelector('[data-translation-locale="en"]'),
//     ).not.toBeNull();

//     expect(
//       container.querySelector('[data-translation-locale="km"]'),
//     ).not.toBeNull();
//   });

//   it("renders an explicit empty state without manufacturing placeholder translations", () => {
//     render(
//       <TranslationKeyTranslationsPanel
//         record={{
//           ...record,

//           translations: [],
//         }}
//       />,
//     );

//     expect(screen.getByText("0 translation values")).toBeInTheDocument();

//     expect(screen.getByText("No translation values yet.")).toBeInTheDocument();

//     expect(screen.queryByText("EN")).not.toBeInTheDocument();

//     expect(screen.queryByText("KM")).not.toBeInTheDocument();
//   });
// });
