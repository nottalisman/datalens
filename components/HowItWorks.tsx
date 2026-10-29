"use client";

import { motion } from "motion/react";

const steps = [
  {
    k: "Overview",
    v: "Rows, columns, size on disk, how much is missing, how much is duplicated.",
  },
  {
    k: "Columns",
    v: "Each column gets a type (number, string, date, boolean, mixed), a fill rate, and a count of distinct values.",
  },
  {
    k: "Numbers",
    v: "Min, max, mean, median, quartiles, standard deviation. Outliers flagged with the 1.5·IQR rule.",
  },
  {
    k: "Categories",
    v: "Top values with counts and share of the column. High-cardinality columns get a note instead of a wall of bars.",
  },
  {
    k: "Issues",
    v: "A ranked list: mostly-empty columns, mixed types, suspicious duplicates, unusual values.",
  },
  {
    k: "Report",
    v: "Download everything as a Markdown or JSON file. Share it, archive it, or paste it into a notebook.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-border bg-subtle/40">
      <div className="mx-auto max-w-page px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-faint mb-5">
              What you get back
            </p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tighter leading-[1.1]">
              Six sections.
              <br />
              No dashboards.
              <br />
              No training needed.
            </h2>
          </div>

          <div>
            {steps.map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="grid grid-cols-[auto_1fr] gap-6 sm:gap-10 py-5 border-b border-border last:border-b-0"
              >
                <span className="num text-[11px] text-faint tracking-widest pt-1 w-6">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-[15px] font-medium mb-1">{s.k}</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    {s.v}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
