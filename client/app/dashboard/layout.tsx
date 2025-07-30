import { StudentDashboardProvider } from "./student/context/studentContext";
import DashboardLayoutComponent from "./components/DashboardLayoutComponent";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <StudentDashboardProvider>
      <DashboardLayoutComponent>{children}</DashboardLayoutComponent>
    </StudentDashboardProvider>
  )
}
