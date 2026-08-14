import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useSession() {
  const { user, session, isLoaded } = useAuth();
  return {
    data: session && user ? { user: { id: user.id, email: user.email, name: user.user_metadata?.full_name || user.email?.split("@")[0], image: user.user_metadata?.avatar_url } } : null,
    isPending: !isLoaded,
  };
}

export async function updateUser(data: { name?: string; image?: string }) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: data.name,
      avatar_url: data.image,
    },
  });
  if (error) throw error;
}

export function useSignOut() {
  const { signOut } = useAuth();
  const router = useRouter();

  return async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };
}
