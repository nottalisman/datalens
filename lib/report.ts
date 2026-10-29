import type { AnalysisResult } from "./analyze";

export function reportMarkdown(r: AnalysisResult): string {
  const lines: string[] = [];
  lines.push(`# Datalens report — ${r.fileName}`);
  lines.push(`_Generated ${new Date(r.generatedAt).toLocaleString()}_`);
  lines.push("");
  lines.push("## Overview");
  lines.push("");
  lines.push(`- Rows: ${r.rows.toLocaleString()}`);
  lines.push(`- Columns: ${r.cols}`);
  lines.push(
    `- Missing cells: ${r.missingCells.toLocaleString()} (${r.missingPct.toFixed(2)}%)`
  );
  lines.push(`- Duplicate rows: ${r.duplicateRows.toLocaleString()}`);
  lines.push("");

  if (r.issues.length) {
    lines.push("## Issues");
    lines.push("");
    for (const i of r.issues) {
      lines.push(`- **[${i.severity.toUpperCase()}]** ${i.title} — ${i.detail}`);
    }
    lines.push("");
  }

  lines.push("## Columns");
  lines.push("");
  for (const c of r.columns) {
    lines.push(`### ${c.name} _(${c.type})_`);
    lines.push(
      `- Missing: ${c.missing.toLocaleString()} (${c.missingPct.toFixed(1)}%)`
    );
    lines.push(
      `- Unique: ${c.unique.toLocaleString()} (${c.uniquePct.toFixed(1)}%)`
    );
    if (c.type === "number") {
      lines.push(
        `- Min / median / max: ${c.min} / ${c.median?.toFixed(2)} / ${c.max}`
      );
      lines.push(
        `- Mean ± σ: ${c.mean?.toFixed(2)} ± ${c.stdDev?.toFixed(2)}`
      );
      lines.push(`- Q1 / Q3: ${c.q1?.toFixed(2)} / ${c.q3?.toFixed(2)}`);
      if (c.outliers) lines.push(`- Outliers (1.5·IQR): ${c.outliers}`);
    }
    if (c.type === "date") {
      lines.push(`- Range: ${c.minDate} → ${c.maxDate}`);
    }
    if (c.topValues?.length) {
      lines.push(`- Top values:`);
      for (const v of c.topValues) {
        lines.push(`  - \`${v.value}\` — ${v.count} (${v.pct.toFixed(1)}%)`);
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function reportJSON(r: AnalysisResult): string {
  return JSON.stringify(r, null, 2);
}

export function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
