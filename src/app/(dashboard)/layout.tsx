import Sidebar from "@/src/components/navigation/Sidebar";
import Topbar from "@/src/components/topbar/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden select-none">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto bg-zinc-950 p-6 md:p-8 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
