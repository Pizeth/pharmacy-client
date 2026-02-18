export interface Data {
  id: number;
  title: string;
  status: string;
  days: number;
  types: string;
  categories: string;
  office: string;
  // permissionTypes?: string;
  description?: string;
  details?: {
    originId?: string;
    acceptedDate: string;
    acceptedTime: string;
    originDoc?: string;
    recieptant: string;
    currentProcessor: string;
    deliverBy: string;
    note?: string;
    recievedBy: string;
    retrievedBy: string;
    retreivedDate: string;
    stampedBy?: string;
    stampedDate?: string;
    issuanceNumber?: string;
    issuanceDate?: string;
    lastRecipient: string;
    finishedDoc?: string;
    shelveNo?: string;
    archiveNo?: string;
    docSequence?: string;
  };
}

export function createData(
  id: number,
  title: string,
  status: string,
  days: number,
  types: string,
  categories: string,
  office: string,
  // permissionTypes?: string,
  description?: string,
  details?: {
    originId?: string;
    acceptedDate: string;
    acceptedTime: string;
    originDoc?: string;
    recieptant: string;
    currentProcessor: string;
    deliverBy: string;
    note?: string;
    recievedBy: string;
    retrievedBy: string;
    retreivedDate: string;
    stampedBy?: string;
    stampedDate?: string;
    issuanceNumber?: string;
    issuanceDate?: string;
    lastRecipient: string;
    finishedDoc?: string;
    shelveNo?: string;
    archiveNo?: string;
    docSequence?: string;
  },
): Data {
  return {
    id,
    title,
    status,
    days,
    types,
    categories,
    office,
    description,
    details,
  };
}

// Helper arrays for random data generation
const titles = [
  "ប្រកាសស្ដីពីការដាក់លោក ក ឱ្យស្ថិតក្នុងភាពទំេរគ្មានបៀវត្ស",
  "សំណើសុំដំឡើងកាំប្រាក់ជូនមន្ត្រីរាជការ",
  "របាយការណ៍បូកសរុបការងារប្រចាំខែ",
  "លិខិតអញ្ជើញចូលរួមកិច្ចប្រជុំបូកសរុបការងារ",
  "សេចក្តីសម្រេចស្តីពីការបង្កើតគណៈកម្មការ",
  "សំណើទិញសម្ភារៈការិយាល័យសម្រាប់ឆ្នាំ២០២៦",
  "លិខិតសុំច្បាប់ឈប់សម្រាកប្រចាំឆ្នាំ",
  "ដីកាបញ្ជូនឯកសារទៅនាយកដ្ឋានពាក់ព័ន្ធ",
  "កិច្ចសន្យាជួលរថយន្តសម្រាប់ចុះបំពេញបេសកកម្ម",
  "សេចក្តីជូនដំណឹងស្តីពីការរៀបចំពិធីបុណ្យចូលឆ្នាំខ្មែរ",
];

export const statuses = ["ធម្មតា", "ប្រញ៉ាប់", "ប្រញ៉ាប់ណាស់"];
export const docTypes = [
  "ឯកសាមុខការ",
  "រដ្ឋបាល",
  "ហិរញ្ញវត្ថុ",
  "បុគ្គលិក",
  "បច្ចេកទេស",
];
export const categories = [
  "ទំនេរគ្មានបៀវត្ស",
  "ដំឡើងថ្នាក់",
  "តែងតាំង",
  "ផ្ទេរភារកិច្ច",
  "ចូលនិវត្តន៍",
  "សំណើសុំច្បាប់ឈប់សម្រាក",
];
export const offices = [
  "ការិយាល័យបុគ្គលិក",
  "ការិយាល័យក្របខណ្ឌនិងបៀវត្ស",
  "ការិយាល័យអភិវឌ្ឍធនធានមនុស្ស",
  "ការិយាល័យកិច្ចការទូទៅ",
];
const names = [
  "ម៉ាលី",
  "វិរៈ",
  "ធារ៉ូត",
  "សុខា",
  "ចាន់ណា",
  "វណ្ណៈ",
  "ពិសិដ្ឋ",
  "ដារ៉ា",
  "សម្បត្តិ",
  "បូផា",
];
const positions = [
  "រដ្ឋលេខាធិការ",
  "អនុរដ្ឋលេខាធិការ",
  "អគ្គនាយក",
  "ប្រធាននាយកដ្ឋាន",
  "ប្រធានការិយាល័យ",
];
export const permissionType = [
  "ច្បាប់ឈប់ប្រចាំឆ្នាំ",
  "ច្បាប់ឈប់រយៈពេលខ្លី",
  "ច្បាប់ឈប់សម្រាកលំហែមាតុភាព",
  "ច្បាប់ឈប់សម្រាកព្យាបាលជម្ងឺ",
  "ឈប់សម្រាកដោយមានកិច្ចការផ្ទាល់ខ្លួន",
];

// Generator function
const generateRows = (count: number): Data[] => {
  const data: Data[] = [];

  for (let i = 1; i <= count; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomType = docTypes[Math.floor(Math.random() * docTypes.length)];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const randomOffice = offices[Math.floor(Math.random() * offices.length)];
    const randomName1 = names[Math.floor(Math.random() * names.length)];
    const randomName2 = names[Math.floor(Math.random() * names.length)];
    const randomName3 = names[Math.floor(Math.random() * names.length)];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    const day = Math.floor(Math.random() * 28) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    const dateStr = `${day}/${month}/2026`;

    data.push(
      createData(
        i,
        randomTitle,
        randomStatus,
        Math.floor(Math.random() * 15) + 1, // 1-15 days
        randomType,
        randomCat,
        randomOffice,
        `ឯកសារបានដាក់ជូនបង${randomName1} (${dateStr})`,
        {
          originId: `DOC-${2026000 + i}`,
          acceptedDate: `${day}-Jan-2026`,
          acceptedTime: `${Math.floor(Math.random() * 12) + 7}:00 ${Math.random() > 0.5 ? "AM" : "PM"}`,
          originDoc:
            Math.random() > 0.3 ? "https://drive.google.com/..." : undefined,
          recieptant: randomName1,
          currentProcessor: randomPos,
          deliverBy: randomName2,
          recievedBy: randomName3,
          retrievedBy: Math.random() > 0.7 ? randomName2 : "",
          retreivedDate: Math.random() > 0.7 ? dateStr : "",
          stampedBy: Math.random() > 0.5 ? randomName1 : undefined,
          stampedDate: Math.random() > 0.5 ? dateStr : undefined,
          issuanceNumber: Math.random() > 0.5 ? `No.${100 + i}/26` : undefined,
          issuanceDate: Math.random() > 0.5 ? dateStr : undefined,
          lastRecipient: randomName3,
          finishedDoc:
            Math.random() > 0.8 ? "https://drive.google.com/..." : undefined,
          shelveNo: `S-${Math.floor(Math.random() * 10)}`,
          archiveNo: `A-${Math.floor(Math.random() * 100)}`,
          docSequence: `${i.toString().padStart(4, "0")}`,
        },
      ),
    );
  }
  return data;
};

export default generateRows;
