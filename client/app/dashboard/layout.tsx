import { StudentDashboardProvider } from "./student/context/studentContext";
import { LecturerDashboardProvider } from "./lecturer/context/lecturerContext";
import DashboardLayoutComponent from "./components/DashboardLayoutComponent";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <LecturerDashboardProvider>
      <StudentDashboardProvider>
        <DashboardLayoutComponent>{children}</DashboardLayoutComponent>
      </StudentDashboardProvider>
    </LecturerDashboardProvider>
  );
}
