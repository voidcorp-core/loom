import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SessionProvider } from "@/components/layout/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loom.voidcorp.io";

export const metadata: Metadata = {
  title: {
    default: "Loom — AI agents, scaffolded in seconds",
    template: "%s | Loom",
  },
  description:
    "Scaffold production-ready AI agents, skills, and presets into any project. Free, open-source, no lock-in.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Loom",
    title: "Loom — AI agents, scaffolded in seconds",
    description:
      "Scaffold production-ready AI agents, skills, and presets into any project. Free, open-source, no lock-in.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Loom — AI agents, scaffolded in seconds",
    description:
      "Scaffold production-ready AI agents, skills, and presets into any project. Free, open-source, no lock-in.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <ThemeProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
