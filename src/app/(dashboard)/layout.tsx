import { auth } from "@/lib/auth";
import Sidebar from "@/components/dashboard/sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 transition-colors duration-200 dark:bg-[#0c0c0b]">
      <Sidebar />
      <main className="min-h-0 flex-1 overflow-y-auto pl-16 md:pl-0">
        {children}
      </main>
    </div>
  );
}
