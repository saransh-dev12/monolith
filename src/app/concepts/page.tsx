import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { conceptMeta } from "@/components/concepts/demo";

const concepts = Object.values(conceptMeta);

const criteria = [
  ["Visual distinctiveness", "High", "High", "High"],
  ["Reference affinity", "Strong (stat cards, bold data)", "Strong (motion, depth)", "Strong (dashboard density)"],
  ["Landing impact", "Loud, memorable", "Immersive, cinematic", "Editorial, confident"],
  ["Dashboard usability", "Good, high contrast", "Refined, needs restraint", "Strongest, dense and legible"],
  ["Typography", "Graphic, blunt", "Expressive serif", "Exacting, editorial"],
  ["Color system", "Acid / electric / vermilion", "Coral / lilac / mint on void", "Oxblood / ultramarine on bone"],
  ["Animation potential", "Snappy cuts", "Slow spatial morphs", "Precise reveals"],
  ["Accessibility risk", "Contrast good; motion must be tamed", "Low-contrast risk on deep surfaces", "Lowest risk"],
  ["Mobile behavior", "Strong, stacked blocks", "Needs simplification", "Strong, reflows as columns"],
  ["Performance risk", "Low", "Medium (blur, transforms)", "Low"],
  ["Product compatibility", "High", "Medium", "High"],
  ["Build complexity", "Low", "High", "Medium"],
];

export default function ConceptsPage() {
  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-10 sm:px-6 lg:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
        Phase 1 · Concept exploration
      </p>
      <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-grotesk)] text-4xl leading-[0.98] tracking-[-0.03em] sm:text-6xl">
        Three directions for the next Monolith.
      </h1>
      <p className="mt-5 max-w-2xl text-sm leading-6 text-white/55">
        Each preview is a working route with a hero, type and color system, a
        Command Center, a Kanban view, and one interactive component. All data is
        illustrative and isolated from the product database.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {concepts.map((concept) => (
          <Link
            key={concept.route}
            href={concept.route}
            className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Concept {concept.letter}
                </span>
                <ArrowUpRight className="size-4 text-white/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
              <h2 className="mt-3 font-[family-name:var(--font-grotesk)] text-2xl tracking-[-0.02em]">
                {concept.name}
              </h2>
              <p className="mt-1 text-xs text-white/45">{concept.personality}</p>
              <div className="mt-4 flex gap-1">
                {concept.colors.map((color) => (
                  <span
                    key={color}
                    className="h-6 flex-1 rounded-sm ring-1 ring-inset ring-white/10"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <dl className="mt-5 space-y-1 border-t border-white/10 pt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
              <div className="flex justify-between gap-3">
                <dt>Type</dt>
                <dd className="text-right text-white/65">{concept.type}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Motion</dt>
                <dd className="text-right text-white/65">{concept.motion}</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
            Comparison
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
            Inspected at 1440 and 390
          </p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[720px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                <th className="px-3 py-2.5 font-normal">Criterion</th>
                <th className="px-3 py-2.5 font-normal">A · Brutalism</th>
                <th className="px-3 py-2.5 font-normal">B · Atelier</th>
                <th className="px-3 py-2.5 font-normal">C · Control room</th>
              </tr>
            </thead>
            <tbody className="text-white/65">
              {criteria.map(([criterion, a, b, c]) => (
                <tr key={criterion} className="border-b border-white/[0.06] last:border-0">
                  <th className="px-3 py-2.5 text-left font-normal text-white/40">
                    {criterion}
                  </th>
                  <td className="px-3 py-2.5">{a}</td>
                  <td className="px-3 py-2.5">{b}</td>
                  <td className="px-3 py-2.5">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-5 md:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
            Recommendation
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-grotesk)] text-3xl tracking-[-0.02em]">
            C · Neo-Editorial Control Room
          </h2>
        </div>
        <div className="space-y-3 text-sm leading-6 text-white/60">
          <p>
            It carries the largest visual distance from the rejected amber-on-cream
            interface while staying legible in dense operational views. Editorial
            display type gives the landing page a voice; a bone/ink/oxblood system
            with ultramarine signal is memorable without becoming decorative.
          </p>
          <p>
            It keeps the existing data model intact, adapts the reference chart and
            table patterns naturally, and its precise motion reads as sophisticated
            rather than noisy. A is the boldest and fastest to build; B is the most
            immersive but carries the highest contrast and performance risk for
            everyday task work.
          </p>
          <p className="text-white/40">
            Awaiting selection before the production-wide redesign begins.
          </p>
        </div>
      </section>
    </main>
  );
}
