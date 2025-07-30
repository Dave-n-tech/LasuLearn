import { LucideIcon } from "lucide-react";

export type User = {
  id: Number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  matricNo?: string;
};

export interface SidebarLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

export enum Role {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  ADMIN = "ADMIN",
}

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  matricNo: string;
  email: string;
  password: string;
  role: Role;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  refreshAccessToken: () => void;
  login: (formData: LoginFormData) => void;
  register: (formData: RegisterFormData) => void;
  logout: () => void;
  StudentSideBarLinks: SidebarLink[];
  LecturerSideBarLinks: SidebarLink[];
};

// student dashboard types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface CourseLecture {
  id: string;
  title: string;
  videoUrl: string;
  courseId: number;
  duration: number;
  createdAt: Date;
  quizzes: {
    id: number;
    question: string;
    options: string;
  }[];
}

export interface CourseLectureProgress {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  createdAt: string;
  attendanceLogs: {
    engagementScore: number;
    markedAt: string;
    wasPresent: boolean;
  }[];
  progresses: {
    id: string;
    watched: boolean;
    watchTime: number;
    skippedTime: number;
    completedAt: string | null;
  }[];
  quizSubmissions: {
    id: string;
    quizId: string;
    lectureId: string;
  }[];
}

export interface CourseLecturer {
  id: string;
  firstName: string;
  lastName: string;
}

export interface EnrolledCourse {
  course: {
    id: string;
    title: string;
    description: string;
    code: string;
    lecturer: CourseLecturer;
    lectures: CourseLectureProgress[];
  };
}
