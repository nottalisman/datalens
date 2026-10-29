import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Datalens profiles a spreadsheet: what it measures, how it decides types, and why nothing is ever uploaded.",
};

export default function About() {
  return (
    <article className="mx-auto max-w-prose px-5 sm:px-8 pt-16 sm:pt-24 pb-24">
      <p className="text-[11px] uppercase tracking-widest text-faint mb-5">
        About
      </p>
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tighter leading-[1.1]">
        A spreadsheet should explain itself.
      </h1>

      <div className="prose-content mt-10 text-[15px] leading-[1.75] text-ink space-y-5">
        <p>
          Most spreadsheets arrive half-trusted. Someone exported them from a
          system you don&apos;t have access to, filled a few columns by hand,
          and dropped the file in a shared drive with no README. Before you can
          use it you need to know: how big is it? What&apos;s in each column?
          What&apos;s missing? What&apos;s obviously wrong?
        </p>
        <p>
          Datalens answers those questions. You drop in a CSV or Excel file and
          it walks the data the way a careful analyst would: it counts rows,
          infers types column by column, flags missing cells and mixed types,
          computes summary statistics for numeric columns, finds exact duplicate
          rows, and runs a 1.5·IQR outlier check. Then it writes the answers
          out in plain English, with the quietest possible chart next to each
          one.
        </p>
        <p>
          Everything runs in your browser. The file never travels over the
          network — not to Datalens, not to anyone. You can confirm that in the
          browser&apos;s network tab. The report you download is generated
          locally too.
        </p>
        <p>
          Datalens is deliberately small. It is not a BI tool, a notebook, or a
          cleaning pipeline. It is the five minutes between opening a file and
          deciding what to do with it.
        </p>
      </div>

      <div className="mt-14 pt-10 border-t border-border">
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 text-[14px] font-medium border-b border-ink pb-0.5"
        >
          Try it on a file <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
