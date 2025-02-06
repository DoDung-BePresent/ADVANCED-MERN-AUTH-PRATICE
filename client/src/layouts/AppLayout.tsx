
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth-provider";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Header />
          <Outlet />
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default AppLayout;
