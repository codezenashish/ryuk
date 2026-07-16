"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SidebarProfile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    // Thoda feel aane ke liye confirm bhi karwa sakte ho, ya direct logout
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  // Jab tak check kar raha hai ki user login hai ya nahi
  if (isPending) {
    return (
      <div className="animate-pulse p-4 text-sm text-zinc-500">
        Loading profile...
      </div>
    );
  }

  // Agar galti se session nahi mila toh kuch mat dikhao
  if (!session) return null;

  return (
    // mt-auto (margin-top: auto) isko sidebar me sabse neeche push kar dega
    <div
      onClick={handleLogout}
      title="Click to Log Out"
      className="group mt-auto flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
    >
      {/* Avatar Section */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 group-hover:bg-red-500/20">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          // Agar photo nahi hai toh naam ka pehla akshar dikhao
          <span className="text-sm font-bold text-zinc-300 uppercase group-hover:text-red-500">
            {session.user.name?.charAt(0) || "U"}
          </span>
        )}
      </div>

      {/* Name Section */}
      <div className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
        <p className="text-sm font-medium text-zinc-200 group-hover:text-red-500">
          {session.user.name}
        </p>
        <p className="text-xs text-zinc-500 group-hover:text-red-400">
          Click to logout
        </p>
      </div>
    </div>
  );
}
