"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import UploadFlow from "./UploadFlow";
import Results from "./Results";
import { analyze, type AnalysisResult } from "@/lib/analyze";
import { parseCSV, parseExcel, parsePasted } from "@/lib/parse";
import { sampleData } from "@/lib/sample";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; message: string }
  | { kind: "success"; result: AnalysisResult }
  | { kind: "error"; message: string };

function AnalyzeInner() {
  const params = useSearchParams();
  const sampleFlag = params.get("sample");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const runWithSample = useCallback(() => {
    setStatus({ kind: "loading", message: "Loading sample dataset…" });
    setTimeout(() => {
      try {
        const rows = sampleData();
        const result = analyze(rows, "sample-orders-2026.csv");
        setStatus({ kind: "success", result });
      } catch (e) {
        setStatus({
          kind: "error",
          message: "Couldn't load the sample. Try refreshing the page.",
        });
      }
    }, 400);
  }, []);

  useEffect(() => {
    if (sampleFlag === "1" && status.kind === "idle") {
      runWithSample();
    }
  }, [sampleFlag, status.kind, runWithSample]);

  const handleFile = useCallback(async (file: File) => {
    setStatus({ kind: "loading", message: `Reading ${file.name}…` });
    try {
      const name = file.name.toLowerCase();
      let rows: Record<string, unknown>[] = [];
      if (name.endsWith(".csv") || name.endsWith(".tsv") || name.endsWith(".txt")) {
        rows = await parseCSV(file);
      } else if (
        name.endsWith(".xlsx") ||
        name.endsWith(".xls") ||
        name.endsWith(".xlsm")
      ) {
        rows = await parseExcel(file);
      } else {
        setStatus({
          kind: "error",
          message: `${file.name} isn't a format Datalens recognizes. Try a .csv or .xlsx file.`,
        });
        return;
      }
      if (rows.length === 0) {
        setStatus({
          kind: "error",
          message: `${file.name} opened, but no rows were found. Is the first row the header?`,
        });
        return;
      }
      const result = analyze(rows, file.name);
      setStatus({ kind: "success", result });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus({
        kind: "error",
        message: `Couldn't read that file — ${msg}`,
      });
    }
  }, []);

  const handlePaste = useCallback(async (text: string) => {
    setStatus({ kind: "loading", message: "Parsing your data…" });
    try {
      const rows = parsePasted(text);
      if (rows.length === 0) {
        setStatus({
          kind: "error",
          message:
            "No rows were detected. Make sure the first line is a header and columns are separated by tabs or commas.",
        });
        return;
      }
      const result = analyze(rows, "pasted-data");
      setStatus({ kind: "success", result });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setStatus({ kind: "error", message: msg });
    }
  }, []);

  const reset = useCallback(() => setStatus({ kind: "idle" }), []);

  return (
    <div className="mx-auto max-w-page px-5 sm:px-8 pt-10 sm:pt-16 pb-16">
      <AnimatePresence mode="wait">
        {status.kind === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <UploadFlow
              onFile={handleFile}
              onPaste={handlePaste}
              onSample={runWithSample}
            />
          </motion.div>
        )}

        {status.kind === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-24 flex flex-col items-center justify-center text-center"
          >
            <div className="flex gap-1.5 mb-5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-ink"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            <p className="text-[14px] text-muted">{status.message}</p>
          </motion.div>
        )}

        {status.kind === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-prose mx-auto py-16"
          >
            <div className="border border-bad/40 bg-bad/5 rounded-lg p-6">
              <p className="text-[11px] uppercase tracking-widest text-bad mb-2">
                Couldn&apos;t finish
              </p>
              <p className="text-[15px] leading-relaxed">{status.message}</p>
              <button
                onClick={reset}
                className="mt-5 text-[13px] font-medium border-b border-ink pb-0.5"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}

        {status.kind === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Results result={status.result} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnalyzeClient() {
  return (
    <Suspense fallback={null}>
      <AnalyzeInner />
    </Suspense>
  );
}
