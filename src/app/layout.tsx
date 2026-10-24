import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { MotionProvider } from "@/components/motion/motion-provider";

import { getSiteUrl } from "@/lib/env";

import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-atelier-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-atelier-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-atelier-mono",
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
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1fa" },
    { media: "(prefers-color-scheme: dark)", color: "#08060f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
