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
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string | null;
  createdAt: Date;
  lecturerId: number;
  lecturer: CourseLecturer;
  enrollments: {
    id: number;
    userId: number;
    courseId: number;
  }[];
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
  createdAt: Date;
  attendanceLogs: {
    engagementScore: number;
    markedAt: string;
    wasPresent: boolean;
  }[];
  progresses: {
    id: string;
    userId: string;
    watched: boolean;
    watchTime: number;
    skippedTime: number;
    completedAt: string | null;
  }[];
  quizzes: {
    id: number;
    question: string;
    options: string;
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

export interface DiscussionPost {
  id: string;
  userId?: string;
  courseId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  replies?: DiscussionReply[];
}

export interface DiscussionReply {
  id: string;
  postId?: string;
  userId?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrolledCourse {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  user: {
    id: string;
  };
  course: {
    id: string;
    title: string;
    description: string;
    code: string;
    lecturer: CourseLecturer;
    lectures: CourseLectureProgress[];
    discussionPosts: DiscussionPost[];
  };
}
