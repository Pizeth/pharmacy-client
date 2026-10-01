// src/components/link/data.ts

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
    category: "សំណើសុំ",
    fileSize: "1.2 MB",
    lastUpdated: "2026-01-15",
    fileType: "PDF",
    description: "សំណើសុំច្បាប់ឈប់សម្រាកសម្រាប់មន្រ្តីរាជការស៊ីវិល",
    driveUrl:
      "https://drive.google.com/drive/folders/1xf6GkjcmSIfrdPbGr-27bGrm9yw75pVE",
  },
  {
    id: "DOC-2026-002",
    title: "ពាក្សស្នើសុំវិញ្ញាបនបត្ររដ្ឋបាល និងវិញ្ញាបនបត្របញ្ជាក់ប្រាក់បៀវត្ស",
    category: "សំណើសុំ",
    fileSize: "840 KB",
    lastUpdated: "2026-02-10",
    fileType: "PDF",
    description:
      "សំណើសុំវិញ្ញាបនបត្ររដ្ឋបាល និងវិញ្ញាបនបត្របញ្ជាក់ប្រាក់បៀវត្ស",
    driveUrl:
      "https://drive.google.com/drive/folders/1EBlkw9sEKR_CKpUpXSZVULWRsScP9apY",
  },
  {
    id: "DOC-2026-003",
    title: "ពាក្យស្នើសុំដំឡើងថ្នាក់ និងឋានន្តរស័ក្តិ តាមកម្រិតសញ្ញាបត្រ",
    category: "សំណើសុំ",
    fileSize: "2.1 MB",
    lastUpdated: "2025-11-20",
    fileType: "PDF",
    description: "សំណើសុំដំឡើងថ្នាក់ និងឋានន្តរស័ក្តិ តាមកម្រិតសញ្ញាបត្រ",
    driveUrl:
      "https://drive.google.com/drive/folders/19Xa9Bd68SKGo8PQHaA7XRZg7sMElLJpF",
  },
  {
    id: "DOC-2026-004",
    title: "ពាក្យស្នើសុំដំឡើងថ្នាក់ និងឋានន្តរស័ក្តិ តាមវេនអតីតភាព វេនជ្រើសរើស",
    category: "សំណើសុំ",
    fileSize: "3.4 MB",
    lastUpdated: "2026-03-01",
    fileType: "DOCX",
    description:
      "សំណើសុំដំឡើងថ្នាក់ និងឋានន្តរស័ក្តិ តាមវេនអតីតភាព វេនជ្រើសរើស",
    driveUrl:
      "https://drive.google.com/drive/folders/1hxMQ_DnpE9W-iTau_zhjYaJsMXJ7gGT0",
  },
  {
    id: "DOC-2026-005",
    title: "ពាក្យស្នើសុំឱ្យស្ថិតនៅក្នុងភាពទំនេរគ្មានបៀវត្ស",
    category: "សំណើសុំ",
    fileSize: "450 KB",
    lastUpdated: "2026-01-05",
    fileType: "PDF",
    description: "សំណើសុំឱ្យស្ថិតនៅក្នុងភាពទំនេរគ្មានបៀវត្ស",
    driveUrl:
      "https://drive.google.com/drive/folders/1s5LnW-_ZAOIwXV_829nyYqUINQwi8hMf",
  },
  {
    id: "DOC-2026-006",
    title: "ពាក្យស្នើសុំឱ្យស្ថិតនៅក្រៅក្របខ័ណ្ឌដើម",
    category: "សំណើសុំ",
    fileSize: "1.1 MB",
    lastUpdated: "2025-12-18",
    fileType: "PDF",
    description: "សំណើសុំឱ្យស្ថិតនៅក្រៅក្របខ័ណ្ឌដើម",
    driveUrl:
      "https://drive.google.com/drive/folders/1NKJTNAJRKmBq4R3Ek69hoyYtrthLXEAy",
  },
  {
    id: "DOC-2026-007",
    title: "ពាក្យខុំចូលបម្រើការងារវិញ",
    category: "សំណើសុំ",
    fileSize: "1.8 MB",
    lastUpdated: "2026-02-28",
    fileType: "PDF",
    description: "សំណើសុំចូលបម្រើការងារវិញ",
    driveUrl:
      "https://drive.google.com/drive/folders/1KGIiZJucE0oQMXuhJbUQXIt-C1CmaQZy",
  },
  {
    id: "DOC-2026-008",
    title: "ពាក្យស្នើសុំចូលនិវត្តន៍មុនកាលកំណត់ (អតីតភាពការងារ ៣០ឆ្នាំ)",
    category: "សំណើសុំ",
    fileSize: "920 KB",
    lastUpdated: "2025-10-12",
    fileType: "DOCX",
    description: "សំណើសុំចូលនិវត្តន៍មុនកាលកំណត់ (អតីតភាពការងារ ៣០ឆ្នាំ)",
    driveUrl:
      "https://drive.google.com/drive/folders/1cC4j9U3fWnTFGN01RKkI7raOZMTXlfRz",
  },
  {
    id: "DOC-2026-009",
    title: "ពាក្យស្នើសុំអនុញ្ញាតចូលរួមប្រឡងប្រជែងតាមក្រសួង ស្ថាប័ន",
    category: "សំណើសុំ",
    fileSize: "920 KB",
    lastUpdated: "2025-10-12",
    fileType: "DOCX",
    description: "សំណើសុំអនុញ្ញាតចូលរួមប្រឡងប្រជែងតាមក្រសួង ស្ថាប័ន",
    driveUrl:
      "https://drive.google.com/drive/folders/1B4oFjFDon40tjsCC7uKIWWu9KTzXk8dV",
  },
  {
    id: "DOC-2026-010",
    title: "ពាក្យសុំលាឈប់ពីក្របខ័ណ្ឌមន្រ្តីរាជការ",
    category: "សំណើសុំ",
    fileSize: "920 KB",
    lastUpdated: "2025-10-12",
    fileType: "DOCX",
    description: "សំណើសុំលាឈប់ពីក្របខ័ណ្ឌមន្រ្តីរាជការ",
    driveUrl:
      "https://drive.google.com/drive/folders/17AYeHrC4O0uje7s0MhzS0hvAmg10mtn2",
  },
  {
    id: "DOC-2026-011",
    title:
      "ការស្នើសុំនិងលុបប្រាក់វិភាជន៍គ្រួសារមន្រ្តីរាជការស៊ីវិលសម្រាប់សហព័ទ្ធនិងកូន",
    category: "សំណើសុំ",
    fileSize: "920 KB",
    lastUpdated: "2025-10-12",
    fileType: "DOCX",
    description:
      "សំណើសុំនិងលុបប្រាក់វិភាជន៍គ្រួសារមន្រ្តីរាជការស៊ីវិលសម្រាប់សហព័ទ្ធនិងកូន",
    driveUrl:
      "https://drive.google.com/drive/folders/1ZnQau90q4L73fDPkH5BR75ZBoQchhjWR",
  },
];

export const PUBLIC_DOCUMENT_CATEGORIES = [
  "ទាំងអស់",
  "សំណើសុំ",
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
