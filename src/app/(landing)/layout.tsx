import React from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-neutral-950 min-h-screen w-full">
      <main className="grow w-full flex">{children}</main>
    </div>
  );
}
