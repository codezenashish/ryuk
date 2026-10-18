import DashboardHeader from "@/components/layout/dashboard-header";
import DashboardSidebar from "@/components/layout/sidebar";
import { getUserProfile } from "@ryuk/auth/server";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserProfile();

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar p-0 md:p-2 md:gap-2 font-sans text-foreground">
      <DashboardSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden bg-background md:rounded-2xl border-0 md:border md:border-sidebar-border shadow-xs">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

