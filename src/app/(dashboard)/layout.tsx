import Sidebar from "@/src/components/navigation/Sidebar";
import WorkspaceHeader from "@/src/components/navigation/WorkspaceHeader";
import PageTransition from "@/src/components/page-transition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden  bg-black">
      <WorkspaceHeader />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div
          className="w-5 h-full border-l border-r border-white/20 opacity-30 shrink-0"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)",
            backgroundSize: "8px 8px",
          }}
        />

        <div className="flex flex-1 flex-col overflow-hidden bg-black">
          <main className="flex-1 overflow-y-auto bg-black p-6 md:p-8 text-white">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
