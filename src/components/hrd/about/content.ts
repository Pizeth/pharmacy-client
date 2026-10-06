export const ABOUT_PAGES = {
  director: { title: "អំពីប្រធាននាយកដ្ឋាន", english: "Department Director" },
  overview: { title: "ព័ត៌មានសង្ខេបនាយកដ្ឋាន", english: "Department Overview" },
  structure: { title: "រចនាសម្ព័ន្ធ", english: "Organization Structure" },
  staff: { title: "ថ្នាក់ដឹកនាំ និងមន្រ្តី", english: "Leadership & Staff" },
} as const;

export type AboutSection = keyof typeof ABOUT_PAGES;
export interface PersonProfile {
  name: string;
  position: string;
  photo?: string;
  biography?: string;
  education?: string[];
  experience?: string[];
}
export interface HrdAboutContent {
  director: PersonProfile | null;
  overview: { vision: string | null; mission: string[]; values: string | null; history: string | null };
  structure: { image: string | null; document: string | null; units: string[] };
  staff: { title: string; people: PersonProfile[] }[];
}

// Add approved HRD information here when it becomes available.
export const HRD_ABOUT_CONTENT: HrdAboutContent = {
  director: null,
  overview: { vision: null, mission: [], values: null, history: null },
  structure: { image: null, document: null, units: [] },
  staff: [],
};
