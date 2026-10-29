import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Datalens.",
};

export default function Terms() {
  const year = new Date().getFullYear();
  return (
    <article className="mx-auto max-w-prose px-5 sm:px-8 pt-16 sm:pt-24 pb-24">
      <p className="text-[11px] uppercase tracking-widest text-faint mb-5">
        Terms
      </p>
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tighter leading-[1.1]">
        Fair, short, and in plain language.
      </h1>
      <p className="mt-4 text-[13px] text-faint">Last updated {year}.</p>

      <div className="mt-10 text-[15px] leading-[1.75] space-y-5">
        <p>
          Datalens is provided as-is. Use it to understand your data, not to
          replace human judgment. We don&apos;t guarantee that the statistics
          or quality flags are correct for every edge case — always sanity-check
          anything that matters.
        </p>
        <p>
          You keep ownership of your data. We make no claim to it; it never
          leaves your browser.
        </p>
        <p>
          Don&apos;t use Datalens to analyze data you aren&apos;t authorized to
          view, or in a way that violates the law of your jurisdiction.
        </p>
        <p>
          If you spot a bug, or a case where the analysis misleads, write to{" "}
          <a
            href="mailto:hello@datalens.app"
            className="border-b border-ink pb-0.5"
          >
            hello@datalens.app
          </a>
          .
        </p>
      </div>
    </article>
  );
}
