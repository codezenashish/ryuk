import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      {/* Clerk ka official ready-made Login Form component */}
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#4f46e5", // DevNest ka Indigo theme set karne ke liye
          },
        }}
      />
    </div>
  );
}
