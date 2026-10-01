// src/components/link/siteInfo.ts

import type { PublicDocumentsSiteInfo } from "./types";

/**
 * Footer content.
 *
 * TODO: replace the placeholder contact details below with the real
 * ones. Any contact field can be removed and its row disappears from
 * the footer. Each phone entry shows the name (Telegram link) and the
 * number (tel: link) side by side; the address opens Google Maps and
 * the email becomes a mailto: link.
 */
export const PUBLIC_DOCUMENTS_SITE: PublicDocumentsSiteInfo = {
  name: "ឯកសារសាធារណៈ",
  tagline: "ទម្រង់ពាក្យស្នើសុំសម្រាប់មន្រ្តីរាជការស៊ីវិល និងឯកសារសាធារណៈផ្សេងៗ",
  organization: "អគ្គលេខាធិការដ្ឋានក្រសួងមុខងារសាធារណៈ នាយកដ្ឋានធនធានមនុស្ស",
  contact: {
    address: {
      text: "ទីស្ដីការក្រសួងមុខងារសាធារណៈ អគារ «ក» ជាន់ទី៤ បន្ទប់៤០១",
      // Paste the Google Maps "Share" link for the exact place. Without
      // it, the address text is used as a Google Maps search instead.
      mapUrl: "https://maps.app.goo.gl/XdbVNSJ5Wws3LLa38",
    },
    phones: [
      {
        name: "លោកស្រី សន ម៉ាលី",
        number: "+855 97 824 2255",
        // Opens this person's Telegram when the name is clicked.
        // Accepts "https://t.me/username", "@username" or "+855...".
        telegram: "https://t.me/SORN_MALY",
      },
    ],
    email: "sornmaly95@gmail.com",
    hours: "ច័ន្ទ – សុក្រ, ៧:០០ – ១៧:៣០",
  },
};
