import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "MindTrack - Mental Wellness Tracker",
  description: "Mental Wellness Tracker for Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className={inter.className}>
        <SkipLink />
        <main id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
          {children}
        </main>
      </body>
    </html>
  );
}
