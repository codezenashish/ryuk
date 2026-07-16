import AuthBranding from "@/features/auth/components/auth_branding";
import SignupForm from "@/features/auth/components/signup-form";

export default function Signup() {
  return (
    <div className="grid min-h-screen bg-black md:grid-cols-2">
      <AuthBranding />
      <main className="flex min-h-screen items-center justify-center">
        <SignupForm />
      </main>
    </div>
  );
}
