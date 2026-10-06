// src/components/hrd/data.ts

import type { PublicDocumentRecord } from "./types";

/**
 * Static directory content.
 *
 * Add driveUrl (Google Drive) or fileUrl (a file under /public) to a
 * row to make it real. Rows without either fall back to a generated
 * placeholder download.
 */
export const PUBLIC_DOCUMENTS: readonly PublicDocumentRecord[] = [
  {
    id: "DOC-2026-001",
    title: "ពាក្យស្នើសុំអនុញ្ញាតច្បាប់ឈប់សម្រាក",
    category: "ពាក្យស្នើសុំ",
    fileSize: "401 KB",
    lastUpdated: "2026-01-15",
    fileTypes: ["PDF", "DOCX"],
    description: "ពាក្យស្នើសុំច្បាប់ឈប់សម្រាកសម្រាប់មន្រ្តីរាជការស៊ីវិល",
    driveUrl:
      "https://drive.google.com/drive/folders/1xf6GkjcmSIfrdPbGr-27bGrm9yw75pVE",
  },
  {
    id: "DOC-2026-002",
    title: "ពាក្សស្នើសុំវិញ្ញាបនបត្ររដ្ឋបាល និងវិញ្ញាបនបត្របញ្ជាក់ប្រាក់បៀវត្ស",
    category: "ពាក្យស្នើសុំ",
    fileSize: "350 KB",
    lastUpdated: "2026-02-10",
    fileTypes: ["PDF", "DOCX"],
    description:
      "ពាក្យស្នើសុំវិញ្ញាបនបត្ររដ្ឋបាល និងវិញ្ញាបនបត្របញ្ជាក់ប្រាក់បៀវត្ស",
    driveUrl:
      "https://drive.google.com/drive/folders/1EBlkw9sEKR_CKpUpXSZVULWRsScP9apY",
  },
  {
    id: "DOC-2026-003",
    title: "ពាក្យស្នើសុំដំឡើងថ្នាក់ និងឋានន្តរស័ក្តិ តាមកម្រិតសញ្ញាបត្រ",
    category: "ពាក្យស្នើសុំ",
    fileSize: "250 KB",
    lastUpdated: "2025-11-20",
    fileTypes: ["PDF", "DOCX"],
    description: "ពាក្យស្នើសុំដំឡើងថ្នាក់ និងឋានន្តរស័ក្តិ តាមកម្រិតសញ្ញាបត្រ",
    driveUrl:
      "https://drive.google.com/drive/folders/19Xa9Bd68SKGo8PQHaA7XRZg7sMElLJpF",
  },
  {
    id: "DOC-2026-004",
    title: "ពាក្យស្នើសុំដំឡើងថ្នាក់ និងឋានន្តរស័ក្តិ តាមវេនអតីតភាព វេនជ្រើសរើស",
    category: "ពាក្យស្នើសុំ",
    fileSize: "350 KB",
    lastUpdated: "2026-03-01",
    fileTypes: ["PDF", "DOCX"],
    description:
      "ពាក្យស្នើសុំដំឡើងថ្នាក់ និងឋានន្តរស័ក្តិ តាមវេនអតីតភាព វេនជ្រើសរើស",
    driveUrl:
      "https://drive.google.com/drive/folders/1hxMQ_DnpE9W-iTau_zhjYaJsMXJ7gGT0",
  },
  {
    id: "DOC-2026-005",
    title: "ពាក្យស្នើសុំឱ្យស្ថិតនៅក្នុងភាពទំនេរគ្មានបៀវត្ស",
    category: "ពាក្យស្នើសុំ",
    fileSize: "140 KB",
    lastUpdated: "2026-01-05",
    fileTypes: ["PDF", "DOCX"],
    description: "ពាក្យស្នើសុំឱ្យស្ថិតនៅក្នុងភាពទំនេរគ្មានបៀវត្ស",
    driveUrl:
      "https://drive.google.com/drive/folders/1s5LnW-_ZAOIwXV_829nyYqUINQwi8hMf",
  },
  {
    id: "DOC-2026-006",
    title: "ពាក្យស្នើសុំឱ្យស្ថិតនៅក្រៅក្របខ័ណ្ឌដើម",
    category: "ពាក្យស្នើសុំ",
    fileSize: "135 KB",
    lastUpdated: "2025-12-18",
    fileTypes: ["PDF", "DOCX"],
    description: "ពាក្យស្នើសុំឱ្យស្ថិតនៅក្រៅក្របខ័ណ្ឌដើម",
    driveUrl:
      "https://drive.google.com/drive/folders/1NKJTNAJRKmBq4R3Ek69hoyYtrthLXEAy",
  },
  {
    id: "DOC-2026-007",
    title: "ពាក្យសុំចូលបម្រើការងារវិញ",
    category: "ពាក្យស្នើសុំ",
    fileSize: "350 KB",
    lastUpdated: "2026-02-28",
    fileTypes: ["PDF", "DOCX"],
    description: "ពាក្យស្នើសុំចូលបម្រើការងារវិញ",
    driveUrl:
      "https://drive.google.com/drive/folders/1KGIiZJucE0oQMXuhJbUQXIt-C1CmaQZy",
  },
  {
    id: "DOC-2026-008",
    title: "ពាក្យស្នើសុំចូលនិវត្តន៍មុនកាលកំណត់ (អតីតភាពការងារ ៣០ឆ្នាំ)",
    category: "ពាក្យស្នើសុំ",
    fileSize: "175 KB",
    lastUpdated: "2025-10-12",
    fileTypes: ["PDF", "DOCX"],
    description: "ពាក្យស្នើសុំចូលនិវត្តន៍មុនកាលកំណត់ (អតីតភាពការងារ ៣០ឆ្នាំ)",
    driveUrl:
      "https://drive.google.com/drive/folders/1cC4j9U3fWnTFGN01RKkI7raOZMTXlfRz",
  },
  {
    id: "DOC-2026-009",
    title: "ពាក្យស្នើសុំអនុញ្ញាតចូលរួមប្រឡងប្រជែងតាមក្រសួង ស្ថាប័ន",
    category: "ពាក្យស្នើសុំ",
    fileSize: "490 KB",
    lastUpdated: "2025-10-12",
    fileTypes: ["PDF", "DOCX"],
    description: "ពាក្យស្នើសុំអនុញ្ញាតចូលរួមប្រឡងប្រជែងតាមក្រសួង ស្ថាប័ន",
    driveUrl:
      "https://drive.google.com/drive/folders/1B4oFjFDon40tjsCC7uKIWWu9KTzXk8dV",
  },
  {
    id: "DOC-2026-010",
    title: "ពាក្យសុំលាឈប់ពីក្របខ័ណ្ឌមន្រ្តីរាជការ",
    category: "ពាក្យស្នើសុំ",
    fileSize: "170 KB",
    lastUpdated: "2025-10-12",
    fileTypes: ["PDF", "DOCX"],
    description: "ពាក្យស្នើសុំលាឈប់ពីក្របខ័ណ្ឌមន្រ្តីរាជការ",
    driveUrl:
      "https://drive.google.com/drive/folders/17AYeHrC4O0uje7s0MhzS0hvAmg10mtn2",
  },
  {
    id: "DOC-2026-011",
    title:
      "ការស្នើសុំនិងលុបប្រាក់វិភាជន៍គ្រួសារមន្រ្តីរាជការស៊ីវិលសម្រាប់សហព័ទ្ធនិងកូន",
    category: "ពាក្យស្នើសុំ",
    fileSize: "360 KB",
    lastUpdated: "2025-10-12",
    fileTypes: ["PDF", "DOCX"],
    description:
      "ពាក្យស្នើសុំនិងលុបប្រាក់វិភាជន៍គ្រួសារមន្រ្តីរាជការស៊ីវិលសម្រាប់សហព័ទ្ធនិងកូន",
    driveUrl:
      "https://drive.google.com/drive/folders/1ZnQau90q4L73fDPkH5BR75ZBoQchhjWR",
  },
];

export const PUBLIC_DOCUMENT_CATEGORIES = [
  "ទាំងអស់",
  "ពាក្យស្នើសុំ",
  "លិខិតរដ្ឋបាល",
  "ព្រះរាជក្រឹត្យ",
  "អនុក្រឹត្យ",
  "ប្រកាស",
  "សេចក្ដីសម្រេច",
  "សេចក្ដីជូនដំណឹង",
  "ផ្សេងៗ",
] as const;

export type PublicDocumentCategory =
  (typeof PUBLIC_DOCUMENT_CATEGORIES)[number];
