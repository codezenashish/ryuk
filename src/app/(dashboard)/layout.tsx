import { Nav } from "@/components/navigation/nav";
import Sidebar from "@/components/navigation/sidebar";
import MobileDock from "@/components/navigation/mobile-dock";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-ink bg-paper font-body grid h-screen grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] max-w-7xl mx-auto w-full relative">
      <aside className="hidden lg:block border-r border-line">
        <Sidebar />
      </aside>

      <main className="min-w-0 overflow-y-auto scrollbar-none w-full pb-24 lg:pb-0">
        <header className="sticky top-0 z-50 h-16 border-b border-line bg-paper/80 backdrop-blur-md">
          <Nav />
        </header>
        <section className="px-4 md:px-6">
          {children}
        </section>
      </main>

      <MobileDock />
    </div>
  );
}
