import type { Metadata } from "next";
import DocsSidebar from "./DocsSidebar";

export const metadata: Metadata = {
  title: {
    template: "%s — AutoClaw Docs",
    default: "AutoClaw Documentation",
  },
  description:
    "Documentation for AutoClaw — Deploy and run OpenClaw in minutes",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <DocsSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
