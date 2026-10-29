"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="mx-auto max-w-page px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-widest text-faint mb-6 flex items-center gap-2"
        >
          <span className="inline-block w-6 h-px bg-faint" />
          Datalens · v1.0
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-[2.4rem] sm:text-6xl font-medium tracking-tightest leading-[1.03]"
        >
          Understand your
          <br />
          spreadsheet in the
          <br />
          <span className="relative">
            time it takes to open it.
            <span className="absolute left-0 right-0 bottom-0 h-[6px] bg-accent-soft -z-10" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-7 text-[17px] sm:text-lg text-muted leading-relaxed max-w-xl"
        >
          Drop in a CSV or Excel file. Datalens tells you what&apos;s in it,
          what&apos;s missing, what&apos;s off, and what to look at first —
          without you writing a single formula.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-canvas rounded-md text-[14px] font-medium hover:opacity-90 transition-opacity"
          >
            Analyze a file
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/analyze?sample=1"
            className="inline-flex items-center gap-2 px-5 py-3 border border-border-strong rounded-md text-[14px] font-medium hover:bg-subtle transition-colors"
          >
            <Play size={14} />
            Try with sample data
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-[12px] text-faint"
        >
          No account. No upload. Your file never leaves this browser tab.
        </motion.p>
      </div>
    </section>
  );
}
