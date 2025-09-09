import { LucideIcon } from "lucide-react";

export type User = {
  id: Number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  matricNo?: string;
  level?: string;
  faculty?: string;
  department?: string;
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
  level?: string;
  faculty?: string;
  department?: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refreshAccessToken: () => void;
  login: (formData: LoginFormData) => void;
  register: (formData: RegisterFormData) => void;
  logout: () => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  StudentSideBarLinks: SidebarLink[];
  LecturerSideBarLinks: SidebarLink[];
};

// student dashboard types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
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
  lectures: CourseLectureProgress[];
  discussionPosts: DiscussionPost[];
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
    lectureId: string;
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
    markedAt: Date;
    wasPresent: boolean;
  }[];
  progresses: {
    id: string;
    userId: string;
    watched: boolean;
    watchTime: number;
    skippedTime: number;
    completedAt: Date;
  }[];
  quizzes: {
    id: number;
    lectureId: string;
    question: string;
    options: string;
  }[];
  quizSubmissions: {
    id: string;
    quizId: string;
    lectureId: string;
    isCorrect: boolean;
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
  updatedAt?: Date;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface EnrolledCourse {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  user: {
    id: string;
  };
  course: Course;
}

export interface QuizQuestion {
  id: number;
  lectureId: string;
  question: string;
  options: string[];
  correctAnswer?: string;
}

export interface LecturerCourse {
  id: number;
  createdAt: Date;
  title: string;
  code: string;
  description: string;
  lecturerId: number;
  thumbnail: string;
  enrollments: {
    id: number;
    userId: number;
    courseId: number;
    enrolledAt: Date;
  }[];
  lectures: {
    id: number;
    courseId: number;
    createdAt: Date;
    title: string;
    videoUrl: string;
    duration: number;
    attendanceLogs: {
      id: number;
      userId: number;
      markedAt: Date;
      engagementScore: number;
      wasPresent: boolean;
    }[];
    quizzes: QuizQuestion[];
    quizSubmissions: {
      id: number;
      userId: number;
      isCorrect: boolean;
      selectedAnswer: string;
      quizId: number;
      lectureId: number;
      submittedAt: Date;
    }[];
  }[];
}

// export interface LecturerDashboardData {
//   course: LecturerCourse[];
// }
