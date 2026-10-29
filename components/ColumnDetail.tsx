"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ColumnStats } from "@/lib/analyze";

interface Props {
  column: ColumnStats;
  onClose: () => void;
}

export default function ColumnDetail({ column, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.25 }}
          className="absolute right-0 top-0 h-full w-full sm:max-w-lg bg-canvas border-l border-border overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-canvas/90 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-faint mb-0.5">
                Column
              </p>
              <h2 className="text-lg font-medium tracking-tighter truncate">
                {column.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close column details"
              className="p-2 -mr-2 rounded-md hover:bg-subtle transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-7">
            <div className="grid grid-cols-3 gap-2">
              <Mini label="Type" value={column.type} />
              <Mini
                label="Missing"
                value={`${column.missingPct.toFixed(1)}%`}
              />
              <Mini
                label="Unique"
                value={column.unique.toLocaleString()}
              />
            </div>

            {column.type === "number" && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-faint mb-3">
                  Summary statistics
                </p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] border-t border-border pt-3">
                  <Row k="Min" v={fmt(column.min)} />
                  <Row k="Max" v={fmt(column.max)} />
                  <Row k="Mean" v={fmt(column.mean)} />
                  <Row k="Median" v={fmt(column.median)} />
                  <Row k="Std deviation" v={fmt(column.stdDev)} />
                  <Row k="Q1 / Q3" v={`${fmt(column.q1)} / ${fmt(column.q3)}`} />
                  <Row
                    k="Outliers (1.5·IQR)"
                    v={column.outliers?.toLocaleString() ?? "0"}
                  />
                </dl>
              </div>
            )}

            {column.type === "date" && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-faint mb-3">
                  Date range
                </p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] border-t border-border pt-3">
                  <Row k="Earliest" v={column.minDate ?? "—"} />
                  <Row k="Latest" v={column.maxDate ?? "—"} />
                </dl>
              </div>
            )}

            {column.topValues && column.topValues.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-faint mb-3">
                  Top values
                </p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={column.topValues.map((v) => ({
                        name:
                          v.value.length > 14
                            ? v.value.slice(0, 14) + "…"
                            : v.value,
                        count: v.count,
                      }))}
                      layout="vertical"
                      margin={{ top: 4, right: 12, bottom: 0, left: 4 }}
                    >
                      <CartesianGrid
                        strokeDasharray="2 2"
                        stroke="rgb(var(--border))"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        stroke="rgb(var(--faint))"
                        fontSize={11}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="rgb(var(--faint))"
                        fontSize={11}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "rgb(var(--surface))",
                          border: "1px solid rgb(var(--border))",
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                        cursor={{ fill: "rgb(var(--subtle))" }}
                      />
                      <Bar
                        dataKey="count"
                        fill="rgb(var(--accent))"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {column.topValues.map((v) => (
                    <li
                      key={v.value}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <span className="truncate pr-2">{v.value}</span>
                      <span className="num text-muted shrink-0">
                        {v.count.toLocaleString()} ·{" "}
                        {v.pct.toFixed(1)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {column.typeBreakdown && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-faint mb-3">
                  Type breakdown
                </p>
                <ul className="space-y-1 text-[13px] border-t border-border pt-3">
                  {Object.entries(column.typeBreakdown).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span className="capitalize">{k}</span>
                      <span className="num text-muted">
                        {v.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-md p-3 bg-surface">
      <p className="text-[10px] uppercase tracking-widest text-faint">
        {label}
      </p>
      <p className="num text-[14px] font-medium mt-0.5 truncate">{value}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-muted">{k}</dt>
      <dd className="num text-right">{v}</dd>
    </>
  );
}

function fmt(n?: number): string {
  if (n === undefined || n === null || !Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 10000 || (Math.abs(n) < 0.01 && n !== 0))
    return n.toExponential(2);
  return Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2);
}
