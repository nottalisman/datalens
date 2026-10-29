"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, Sheet, ClipboardPaste, Play } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onFile: (f: File) => void;
  onPaste: (text: string) => void;
  onSample: () => void;
}

type Tab = "upload" | "paste" | "sheets";

export default function UploadFlow({ onFile, onPaste, onSample }: Props) {
  const [tab, setTab] = useState<Tab>("upload");
  const [dragging, setDragging] = useState(false);
  const [pasted, setPasted] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
    e.target.value = "";
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-widest text-faint mb-4">
          Step one
        </p>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tighter leading-[1.1]">
          Bring your data in.
        </h1>
        <p className="mt-3 text-muted text-[15px] max-w-xl leading-relaxed">
          Files never leave your browser. Nothing is uploaded, logged, or
          stored.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Input method"
        className="flex items-center gap-1 p-1 bg-subtle rounded-lg w-full sm:w-fit mb-6"
      >
        {([
          { id: "upload", label: "Upload", icon: <Upload size={14} /> },
          { id: "paste", label: "Paste", icon: <ClipboardPaste size={14} /> },
          { id: "sheets", label: "Google Sheets", icon: <Sheet size={14} /> },
        ] as const).map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
              tab === t.id
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "upload" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative border border-dashed rounded-xl p-10 sm:p-14 text-center transition-all ${
              dragging
                ? "border-accent bg-accent-soft/40"
                : "border-border-strong bg-surface"
            }`}
          >
            <div className="flex justify-center mb-5">
              <div className="w-11 h-11 rounded-full bg-subtle flex items-center justify-center text-muted">
                <FileText size={18} />
              </div>
            </div>
            <p className="text-[16px] font-medium mb-1">
              Drop a file here, or click to browse
            </p>
            <p className="text-[13px] text-muted">
              CSV, TSV, XLSX, or XLS — up to about 50 MB in a browser
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-canvas rounded-md text-[13px] font-medium hover:opacity-90 transition-opacity"
            >
              Choose a file
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.tsv,.txt,.xlsx,.xls,.xlsm"
              onChange={onInputChange}
              className="sr-only"
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px bg-border flex-1" />
            <span className="text-[11px] uppercase tracking-widest text-faint">
              or
            </span>
            <div className="h-px bg-border flex-1" />
          </div>

          <button
            onClick={onSample}
            className="mt-6 w-full border border-border-strong rounded-xl p-5 flex items-center justify-between hover:bg-subtle transition-colors group"
          >
            <div className="text-left">
              <p className="text-[14px] font-medium flex items-center gap-2">
                <Play size={14} className="text-accent" />
                Try with sample data
              </p>
              <p className="text-[12px] text-muted mt-0.5">
                180 rows of sales data with planted quality issues
              </p>
            </div>
            <span className="text-muted group-hover:text-ink transition-colors text-[13px]">
              →
            </span>
          </button>
        </motion.div>
      )}

      {tab === "paste" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <label className="block">
            <span className="text-[13px] text-muted mb-2 block">
              Paste rows copied from Excel, Google Sheets, Numbers, or anywhere
              with tabs or commas.
            </span>
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={10}
              placeholder={`name,age,role\nAvery Chen,34,Analyst\nPriya Rao,29,Engineer`}
              className="w-full font-mono text-[13px] p-4 bg-surface border border-border-strong rounded-lg focus:border-accent focus:outline-none resize-y"
            />
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-3 justify-between">
            <p className="text-[12px] text-faint">
              First row is treated as the header.
            </p>
            <button
              onClick={() => onPaste(pasted)}
              disabled={!pasted.trim()}
              className="px-5 py-2.5 bg-ink text-canvas rounded-md text-[13px] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Analyze pasted data
            </button>
          </div>
        </motion.div>
      )}

      {tab === "sheets" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border border-border-strong rounded-xl p-8 bg-surface"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-subtle flex items-center justify-center text-muted shrink-0">
              <Sheet size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-medium">Google Sheets connector</p>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">
                The OAuth connector is still in private beta. For now, open your
                sheet, go to{" "}
                <span className="font-medium text-ink">
                  File → Download → Comma-separated values
                </span>
                , and drop the file into the Upload tab.
              </p>
              <button
                onClick={() => setTab("upload")}
                className="mt-4 text-[13px] font-medium border-b border-ink pb-0.5"
              >
                Switch to upload →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
