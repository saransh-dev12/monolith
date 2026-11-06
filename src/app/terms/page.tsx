import type { Metadata } from "next";

import { LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service · Monolith",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="November 6, 2026">
      <section>
        <h2>The service</h2>
        <p>
          Monolith is a project execution workspace: you describe a project,
          plan it (optionally with an AI draft you review), execute it on a
          board, and read progress derived from your own records. The service
          is provided as-is while it is in public release.
        </p>
      </section>
      <section>
        <h2>Your account</h2>
        <p>
          You are responsible for the content you create and for keeping your
          credentials safe. One account per person; the account owner has
          exclusive access to their records — enforced at the database level.
        </p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not use the service to store unlawful or harmful content.</li>
          <li>Do not attempt to access another account&apos;s records or probe the platform&apos;s security controls.</li>
          <li>Do not exceed the planner&apos;s published daily quota or attempt to bypass it.</li>
        </ul>
      </section>
      <section>
        <h2>AI drafts</h2>
        <p>
          Planner drafts are suggestions generated from your description.
          Review them before confirming; nothing is written to your workspace
          until you explicitly save a plan. Generated content may be wrong or
          incomplete — you stay in charge of what ships.
        </p>
      </section>
      <section>
        <h2>Availability and your data</h2>
        <p>
          The service targets reliable operation but is offered without an
          uptime guarantee while in public release. You can export your content
          from the interface at any time and delete your account — which
          removes all of your records immediately and permanently.
        </p>
      </section>
      <section>
        <h2>Liability</h2>
        <p>
          To the maximum extent permitted by law, Monolith&apos;s author is
          not liable for indirect or consequential damages arising from use of
          the service. Nothing in these terms limits liability that cannot be
          limited by law.
        </p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>
          Material changes to these terms will be reflected in the
          &quot;last updated&quot; date above. Continued use after a change
          means acceptance.
        </p>
      </section>
    </LegalShell>
  );
}
