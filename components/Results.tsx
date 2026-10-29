"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";
import type { AnalysisResult, ColumnStats } from "@/lib/analyze";
import { downloadFile, reportMarkdown, reportJSON } from "@/lib/report";
import ColumnDetail from "./ColumnDetail";
import StatTile from "./StatTile";
import SampleTable from "./SampleTable";

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

export default function Results({ result, onReset }: Props) {
  const [active, setActive] = useState<ColumnStats | null>(null);

  const handleDownload = (fmt: "md" | "json") => {
    const base = result.fileName.replace(/\.[^.]+$/, "") || "report";
    if (fmt === "md") {
      downloadFile(`${base}-datalens.md`, reportMarkdown(result), "text/markdown");
    } else {
      downloadFile(
        `${base}-datalens.json`,
        reportJSON(result),
        "application/json"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Success banner */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start sm:items-center gap-3 px-4 py-3 bg-good/10 border border-good/30 rounded-lg mb-8 flex-col sm:flex-row"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <CheckCircle2 size={16} className="text-good shrink-0" />
          <p className="text-[13px] min-w-0">
            <span className="font-medium">Analysis complete.</span>{" "}
            <span className="text-muted truncate">
              {result.fileName} · {result.rows.toLocaleString()} rows ·{" "}
              {result.cols} columns
            </span>
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-[12px] font-medium inline-flex items-center gap-1.5 text-muted hover:text-ink transition-colors shrink-0"
        >
          <RefreshCw size={12} />
          New analysis
        </button>
      </motion.div>

      {/* Overview */}
      <section className="mb-14">
        <SectionHead eyebrow="01" title="Overview" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <StatTile label="Rows" value={result.rows.toLocaleString()} />
          <StatTile label="Columns" value={result.cols.toString()} />
          <StatTile
            label="Missing"
            value={`${result.missingPct.toFixed(1)}%`}
            tone={result.missingPct > 10 ? "warn" : "default"}
            sub={`${result.missingCells.toLocaleString()} cells`}
          />
          <StatTile
            label="Duplicates"
            value={result.duplicateRows.toLocaleString()}
            tone={result.duplicateRows > 0 ? "warn" : "default"}
            sub="exact row matches"
          />
        </div>
      </section>

      {/* Issues */}
      <section className="mb-14">
        <SectionHead
          eyebrow="02"
          title="Issues"
          sub={
            result.issues.length === 0
              ? "Nothing worth flagging — your data looks clean."
              : `${result.issues.length} thing${result.issues.length > 1 ? "s" : ""} to look at`
          }
        />
        {result.issues.length === 0 ? (
          <div className="mt-6 border border-border rounded-lg px-6 py-10 text-center bg-surface">
            <CheckCircle2 size={22} className="mx-auto text-good mb-3" />
            <p className="text-[14px] text-muted">
              No missing columns, no mixed types, no duplicates. Nice file.
            </p>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border border border-border rounded-lg bg-surface">
            {result.issues.map((issue, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                className="px-5 py-4 flex gap-3 items-start"
              >
                <SeverityDot severity={issue.severity} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">{issue.title}</p>
                  <p className="text-[13px] text-muted mt-0.5 leading-relaxed">
                    {issue.detail}
                  </p>
                </div>
                <span className="num text-[10px] uppercase tracking-widest text-faint pt-1 hidden sm:inline">
                  {issue.severity}
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      {/* Columns */}
      <section className="mb-14">
        <SectionHead
          eyebrow="03"
          title="Columns"
          sub={`${result.cols} column${result.cols === 1 ? "" : "s"} · tap for details`}
        />
        <div className="mt-6 grid gap-2">
          {result.columns.map((c, i) => (
            <motion.button
              key={c.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              onClick={() => setActive(c)}
              className="text-left grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-6 items-center px-4 sm:px-5 py-3 border border-border rounded-lg bg-surface hover:border-border-strong transition-colors"
            >
              <div className="min-w-0">
                <p className="text-[14px] font-medium truncate">{c.name}</p>
                <p className="text-[12px] text-muted truncate sm:hidden">
                  {c.type} · {c.unique.toLocaleString()} unique
                </p>
              </div>
              <TypeBadge type={c.type} />
              <span className="num hidden sm:inline text-[12px] text-muted w-20 text-right">
                {c.unique.toLocaleString()} unique
              </span>
              <MissingBar pct={c.missingPct} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Preview */}
      <section className="mb-14">
        <SectionHead
          eyebrow="04"
          title="Preview"
          sub="first 10 rows, as parsed"
        />
        <div className="mt-6">
          <SampleTable rows={result.sample} columns={result.columns.map((c) => c.name)} />
        </div>
      </section>

      {/* Report */}
      <section>
        <SectionHead
          eyebrow="05"
          title="Report"
          sub="Everything above, in a file you can share."
        />
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleDownload("md")}
            className="border border-border rounded-lg p-5 bg-surface hover:border-border-strong transition-colors text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[14px] font-medium">Markdown report</p>
              <Download size={14} className="text-muted group-hover:text-ink transition-colors" />
            </div>
            <p className="text-[12px] text-muted">
              Human-readable summary with every column, issue, and statistic.
            </p>
          </button>
          <button
            onClick={() => handleDownload("json")}
            className="border border-border rounded-lg p-5 bg-surface hover:border-border-strong transition-colors text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[14px] font-medium">JSON report</p>
              <Download size={14} className="text-muted group-hover:text-ink transition-colors" />
            </div>
            <p className="text-[12px] text-muted">
              Machine-readable, same content. Great for pipelines or notebooks.
            </p>
          </button>
        </div>
      </section>

      {/* Column detail drawer */}
      {active && (
        <ColumnDetail column={active} onClose={() => setActive(null)} />
      )}
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
      <div>
        <p className="num text-[11px] uppercase tracking-widest text-faint mb-1">
          {eyebrow}
        </p>
        <h2 className="text-xl sm:text-2xl font-medium tracking-tighter">
          {title}
        </h2>
      </div>
      {sub && (
        <p className="text-[12px] text-muted hidden sm:block">{sub}</p>
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: ColumnStats["type"] }) {
  const colors: Record<string, string> = {
    number: "text-accent bg-accent-soft",
    string: "text-muted bg-subtle",
    date: "text-good bg-good/10",
    boolean: "text-muted bg-subtle",
    mixed: "text-warn bg-warn/10",
    empty: "text-faint bg-subtle",
  };
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-medium ${colors[type]}`}
    >
      {type}
    </span>
  );
}

function MissingBar({ pct }: { pct: number }) {
  const color =
    pct >= 50 ? "bg-bad" : pct >= 10 ? "bg-warn" : pct > 0 ? "bg-muted" : "bg-good";
  return (
    <div className="hidden sm:flex items-center gap-2 w-32">
      <div className="flex-1 h-1 bg-subtle rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${Math.max(2, 100 - pct)}%` }}
        />
      </div>
      <span className="num text-[11px] text-muted w-10 text-right">
        {(100 - pct).toFixed(0)}%
      </span>
    </div>
  );
}

function SeverityDot({ severity }: { severity: "high" | "medium" | "low" }) {
  if (severity === "high")
    return <AlertCircle size={16} className="text-bad shrink-0 mt-0.5" />;
  if (severity === "medium")
    return <AlertTriangle size={16} className="text-warn shrink-0 mt-0.5" />;
  return <Info size={16} className="text-muted shrink-0 mt-0.5" />;
}
