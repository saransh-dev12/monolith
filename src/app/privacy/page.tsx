import type { Metadata } from "next";

import { LegalShell } from "@/components/legal/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy · Monolith",
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="November 6, 2026">
      <section>
        <h2>What we collect</h2>
        <p>
          Monolith stores exactly what you enter and what the product needs to
          function:
        </p>
        <ul>
          <li>Your account email and the display name you choose.</li>
          <li>The content you create: projects, tasks, milestones, and planner drafts.</li>
          <li>Timestamps of your activity inside the workspace.</li>
        </ul>
        <p>
          There are no analytics trackers, no advertising pixels, and no
          third-party scripts that profile you. Nothing is sold or shared.
        </p>
      </section>
      <section>
        <h2>Where your data lives</h2>
        <p>
          All records live in a managed PostgreSQL database operated through
          Supabase. Every table that stores user content is protected by
          PostgreSQL Row Level Security: queries are scoped to the signed-in
          account at the database level, not merely in the interface. The
          application never reads another account&apos;s rows.
        </p>
      </section>
      <section>
        <h2>AI planning</h2>
        <p>
          The AI planner sends the text you write (and nothing else) to
          OpenAI&apos;s API to draft a plan. Drafts are returned for your
          review and are never saved to the database until you explicitly
          confirm. If the planner is not configured, no data leaves the
          application and the feature states so plainly.
        </p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>
          Monolith sets one thing: the session cookies that keep you signed
          in. No consent banners are needed because there is nothing to
          consent to.
        </p>
      </section>
      <section>
        <h2>Deleting your data</h2>
        <p>
          Deleting your account from the workspace menu immediately and
          permanently removes your account and every project, task, and
          milestone owned by it, through the database&apos;s cascade rules.
          There is no soft-delete retention for account deletion.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Monolith is open source. Questions, requests, or concerns go to{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://github.com/saransh-dev12/monolith/issues"
            target="_blank"
            rel="noreferrer"
          >
            the repository&apos;s issue tracker
          </a>
          .
        </p>
      </section>
    </LegalShell>
  );
}
