import { LucideIcon } from "lucide-react";

export type User = {
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
}

export type AppContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
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
