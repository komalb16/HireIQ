export type Theme = 'light' | 'lavender' | 'violet' | 'blue' | 'red' | 'pink' | 'black' | 'dark';

export interface UserProfile {
  name: string;
  email: string;
  linkedin: string;
}

export interface Settings {
  theme: Theme;
  groqKey: string;
  rapidKey: string;
  phKey?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  via: string;
  postedAt: string;
  salary?: string;
  isLinkedIn?: boolean;
  isIndeed?: boolean;
  isGlassdoor?: boolean;
  isZip?: boolean;
  easyApply?: boolean;
  matchScore?: number;
}

export interface JobAlert {
  id: string;
  name: string;
  title: string;
  location: string;
  skills: string;
  workType: string;
  frequency: number;
  notifyVia: string;
  minSalary?: number;
  lastChecked?: string;
  status: 'running' | 'paused';
}

export interface Question {
  cat: string;
  diff: 'Easy' | 'Medium' | 'Hard' | 'all';
  company: string;
  q: string;
  refAnswer: string;
}

export interface InterviewScore {
  q: string;
  a: string;
  score: number;
  feedback: {
    verdict: string;
    strengths: string;
    improvements: string;
    tip: string;
  };
}

export interface AppStatus {
  id: string;
  title: string;
  company: string;
  status: 'Applied' | 'Screening' | 'Interviewing' | 'Offer Received' | 'Rejected' | 'Wishlist';
  date: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  reminder?: string;
  addedAt: number;
}

export interface Resume {
  id: string;
  name: string;
  content: string;
  fileName?: string;
  fileType?: string;
  lastModified: string;
  isActive?: boolean;
}

export interface Notification {
  id: string;
  msg: string;
  date: string;
  ts: number;
  unread: boolean;
}

export interface AppContextState {
  profile: UserProfile;
  settings: Settings;
  apps: AppStatus[];
  alerts: JobAlert[];
  resumes: Resume[];
  notifs: Notification[];
}

export interface AppContextType {
  state: AppContextState;
  setProfile: (profile: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  setApps: (apps: AppStatus[] | ((prev: AppStatus[]) => AppStatus[])) => void;
  setAlerts: (alerts: JobAlert[] | ((prev: JobAlert[]) => JobAlert[])) => void;
  setResumes: (resumes: Resume[] | ((prev: Resume[]) => Resume[])) => void;
  addNotification: (title: string, msg: string) => void;
  setNotifs: (notifs: Notification[] | ((prev: Notification[]) => Notification[])) => void;
  toggleTheme: () => void;
  seedDemoData: () => void;
  logout: () => void;
}
