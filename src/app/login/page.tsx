import AuthBranding from "@/features/auth/components/auth_branding";
import LoginForm from "@/features/auth/components/login-form";

export default function Login() {
  return (
    <div className="grid min-h-screen bg-black md:grid-cols-2">
      <AuthBranding />
      <main className="flex min-h-screen items-center justify-center">
        <LoginForm />
      </main>
    </div>
  );
}
