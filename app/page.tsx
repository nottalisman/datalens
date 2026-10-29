import Link from "next/link";
import { ArrowRight, FileSpreadsheet, Sparkles, Lock } from "lucide-react";
import Hero from "@/components/Hero";
import FeatureRow from "@/components/FeatureRow";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-page px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid md:grid-cols-3 gap-10 md:gap-14">
          <FeatureRow
            number="01"
            icon={<FileSpreadsheet size={18} />}
            title="Bring your data"
            body="Drop a CSV or Excel file, connect a Google Sheet, or paste a table straight from your clipboard. Everything stays in your browser."
          />
          <FeatureRow
            number="02"
            icon={<Sparkles size={18} />}
            title="Read it in plain language"
            body="Row count, column types, missing values, duplicates, outliers — written out, not buried in a formula bar. Charts for the shapes that matter."
          />
          <FeatureRow
            number="03"
            icon={<Lock size={18} />}
            title="Download the report"
            body="Save a clean quality report as Markdown or JSON. Share it with a teammate, attach it to a paper, or keep it as a before-and-after record."
          />
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-page px-5 sm:px-8 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-widest text-faint mb-5">
            For everyone who touches a spreadsheet
          </p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tighter leading-[1.1]">
            Written to feel calm whether you&apos;ve opened a spreadsheet once
            or a thousand times.
          </h2>
          <p className="mt-6 text-muted leading-relaxed text-[15px] max-w-xl">
            Nontechnical teammates get a readable summary. Analysts get the
            quartiles, the distribution plots, the IQR-based outlier flags, and
            a report they can hand off. Same screen, same file, different
            depths.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 mt-10 text-[14px] font-medium border-b border-ink pb-0.5 hover:gap-3 transition-all"
          >
            Open the analyzer
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
