/** HRD FAQ answers are limited to the directory and contact details already published in this app. */
export interface HrdFaqEntry {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly href?: string;
  readonly linkLabel?: string;
}
export const HRD_FAQ: readonly HrdFaqEntry[] = [
  { id:"forms", question:"តើខ្ញុំអាចស្វែងរកទម្រង់ពាក្យស្នើសុំនៅឯណា?",
    answer:"ទម្រង់ពាក្យស្នើសុំ និងឯកសារផ្សេងៗត្រូវបានរៀបចំក្នុងបណ្ដុំឯកសាររបស់នាយកដ្ឋាន។ អ្នកអាចស្វែងរកតាមឈ្មោះ និងប្រភេទឯកសារ។",
    href:"/hrd/documents",linkLabel:"ទៅកាន់បណ្ដុំឯកសារ" },
  { id:"download",question:"តើខ្ញុំអាចទាញយកឯកសារដោយរបៀបណា?",
    answer:"បើកបណ្ដុំឯកសារ រកឯកសារដែលត្រូវការ រួចប្រើតំណទាញយក ឬតំណឯកសារដែលបានផ្ដល់។ ឯកសារខ្លះភ្ជាប់ទៅ Google Drive។",
    href:"/hrd/documents",linkLabel:"មើលឯកសារទាំងអស់" },
  { id:"formats",question:"តើមានឯកសារជាប្រភេទអ្វីខ្លះ?",
    answer:"បណ្ដុំឯកសារបង្ហាញប្រភេទឯកសារដែលអាចប្រើបាន ដូចជា PDF និង DOCX សម្រាប់ឯកសារនីមួយៗ។ សូមពិនិត្យប្រភេទដែលបង្ហាញជាមួយឯកសារមុនពេលទាញយក។" },
  { id:"hours",question:"តើនាយកដ្ឋានបើកធ្វើការនៅពេលណា?",
    answer:"ម៉ោងធ្វើការដែលបានបង្ហាញស្ថិតនៅក្នុងព័ត៌មានទំនាក់ទំនង។ សូមពិនិត្យទំព័រទំនាក់ទំនងសម្រាប់ព័ត៌មានថ្មីៗ។",
    href:"/hrd/contact",linkLabel:"ព័ត៌មានទំនាក់ទំនង" },
  { id:"contact",question:"តើខ្ញុំអាចសួរព័ត៌មានបន្ថែមតាមរបៀបណា?",
    answer:"អ្នកអាចទាក់ទងតាមទូរសព្ទ អ៊ីម៉ែល ឬ Telegram តាមព័ត៌មានដែលមាននៅលើទំព័រទំនាក់ទំនង។",
    href:"/hrd/contact",linkLabel:"ទាក់ទងនាយកដ្ឋាន" },
];
