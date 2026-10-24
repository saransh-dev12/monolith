import type { Metadata } from "next";
import {
  Archivo_Black,
  Bodoni_Moda,
  Instrument_Serif,
  Inter_Tight,
  JetBrains_Mono,
  Manrope,
  Space_Mono,
} from "next/font/google";

import { ConceptFrame } from "@/components/concepts/concept-frame";

export const metadata: Metadata = {
  title: "Monolith · Concept exploration",
  robots: { index: false, follow: false },
};

const archivo = Archivo_Black({
  variable: "--font-brutal-display",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-brutal-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

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

const bodoni = Bodoni_Moda({
  variable: "--font-editorial-display",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-editorial-sans",
  subsets: ["latin"],
});

const conceptFontVars = [
  archivo.variable,
  spaceMono.variable,
  instrument.variable,
  manrope.variable,
  jetbrains.variable,
  bodoni.variable,
  interTight.variable,
].join(" ");

export default function ConceptsLayout({ children }: LayoutProps<"/concepts">) {
  return (
    <div className={conceptFontVars}>
      <ConceptFrame>{children}</ConceptFrame>
    </div>
  );
}
