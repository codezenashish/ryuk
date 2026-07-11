import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <Navbar />
      <main className="flex w-full grow flex-col">{children}</main>
      <Footer />
    </div>
  );
}
