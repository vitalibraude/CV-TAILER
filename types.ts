
export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  graduationYear: string;
}

export interface CVData {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export type AppState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
