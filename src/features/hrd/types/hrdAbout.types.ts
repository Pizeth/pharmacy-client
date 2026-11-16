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
