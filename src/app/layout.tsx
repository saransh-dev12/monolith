import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Inter_Tight,
  JetBrains_Mono,
  Syne,
} from "next/font/google";
import { ThemeProvider } from "next-themes";

import { MotionProvider } from "@/components/motion/motion-provider";

import { getSiteUrl } from "@/lib/env";

import "./globals.css";

const syne = Syne({
  variable: "--font-mol-display",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-mol-editorial",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const interTight = Inter_Tight({
  variable: "--font-mol-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mol-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Monolith · Plan and execute",
    template: "%s",
  },
  description:
    "Monolith turns a project idea into a reviewed plan, then into milestones, tasks, and a board that reports progress from real records.",
  applicationName: "Monolith",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080808",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${fraunces.variable} ${interTight.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
