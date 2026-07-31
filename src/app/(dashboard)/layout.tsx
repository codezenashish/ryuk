import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-olive-50 dark:bg-neutral-950">
      <Sidebar />
      <main className="min-h-0 flex-1 overflow-y-auto pl-16 md:pl-0">
        {children}
      </main>
    </div>
  );
}
