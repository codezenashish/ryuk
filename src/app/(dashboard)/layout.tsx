import Sidebar from "@/src/components/navigation/Sidebar";
import WorkspaceHeader from "@/src/components/navigation/WorkspaceHeader";
import PageTransition from "@/src/components/PageTransition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-black">
      <WorkspaceHeader />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden bg-black">
          <main className="flex-1 overflow-y-auto bg-black text-white">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
