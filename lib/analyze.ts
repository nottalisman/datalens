export type ColumnType = "number" | "string" | "date" | "boolean" | "mixed" | "empty";

export interface ColumnStats {
  name: string;
  type: ColumnType;
  total: number;
  missing: number;
  missingPct: number;
  unique: number;
  uniquePct: number;
  // Numeric
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  q1?: number;
  q3?: number;
  outliers?: number;
  // Categorical / string
  topValues?: { value: string; count: number; pct: number }[];
  avgLength?: number;
  // Date
  minDate?: string;
  maxDate?: string;
  // Mixed
  typeBreakdown?: Record<string, number>;
}

export interface Issue {
  severity: "high" | "medium" | "low";
  column?: string;
  title: string;
  detail: string;
}

export interface AnalysisResult {
  fileName: string;
  rows: number;
  cols: number;
  missingCells: number;
  missingPct: number;
  duplicateRows: number;
  columns: ColumnStats[];
  issues: Issue[];
  sample: Record<string, unknown>[];
  generatedAt: string;
}

const MISSING_TOKENS = new Set([
  "",
  "null",
  "none",
  "na",
  "n/a",
  "nan",
  "nil",
  "undefined",
  "-",
  "--",
  "?",
  "#n/a",
]);

function isMissing(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "number" && Number.isNaN(v)) return true;
  if (typeof v === "string") {
    const t = v.trim().toLowerCase();
    return MISSING_TOKENS.has(t);
  }
  return false;
}

function coerceType(v: unknown): "number" | "string" | "date" | "boolean" | "missing" {
  if (isMissing(v)) return "missing";
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number" && Number.isFinite(v)) return "number";
  if (v instanceof Date && !isNaN(v.getTime())) return "date";
  const s = String(v).trim();
  // boolean strings
  const low = s.toLowerCase();
  if (low === "true" || low === "false" || low === "yes" || low === "no") return "boolean";
  // number
  if (/^-?\d+(\.\d+)?$/.test(s) || /^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) return "number";
  // date — a few common shapes
  if (
    /^\d{4}-\d{2}-\d{2}(T|\s)?/.test(s) ||
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(s) ||
    /^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/.test(s)
  ) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return "date";
  }
  return "string";
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toDate(v: unknown): Date | null {
  if (v instanceof Date && !isNaN(v.getTime())) return v;
  if (typeof v === "string") {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stdDev(xs: number[], m: number): number {
  if (xs.length < 2) return 0;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(v);
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

function analyzeColumn(name: string, values: unknown[]): ColumnStats {
  const total = values.length;
  const seenTypes: Record<string, number> = {};
  const nonMissing: unknown[] = [];
  let missing = 0;

  for (const v of values) {
    const t = coerceType(v);
    if (t === "missing") {
      missing++;
    } else {
      seenTypes[t] = (seenTypes[t] || 0) + 1;
      nonMissing.push(v);
    }
  }

  const presentTypes = Object.keys(seenTypes);
  let type: ColumnType = "empty";
  if (presentTypes.length === 1) type = presentTypes[0] as ColumnType;
  else if (presentTypes.length > 1) {
    // dominant type threshold
    const total2 = nonMissing.length;
    const dominant = presentTypes.sort(
      (a, b) => seenTypes[b] - seenTypes[a]
    )[0];
    if (seenTypes[dominant] / total2 >= 0.95) type = dominant as ColumnType;
    else type = "mixed";
  }

  const uniqSet = new Set(nonMissing.map((v) => String(v).trim()));
  const unique = uniqSet.size;
  const stats: ColumnStats = {
    name,
    type,
    total,
    missing,
    missingPct: total === 0 ? 0 : (missing / total) * 100,
    unique,
    uniquePct: total === 0 ? 0 : (unique / total) * 100,
  };

  if (type === "mixed") {
    stats.typeBreakdown = seenTypes;
  }

  if (type === "number") {
    const nums = nonMissing
      .map(toNumber)
      .filter((n): n is number => n !== null);
    if (nums.length > 0) {
      const sorted = [...nums].sort((a, b) => a - b);
      const m = mean(nums);
      const q1 = quantile(sorted, 0.25);
      const q3 = quantile(sorted, 0.75);
      const iqr = q3 - q1;
      const low = q1 - 1.5 * iqr;
      const high = q3 + 1.5 * iqr;
      stats.min = sorted[0];
      stats.max = sorted[sorted.length - 1];
      stats.mean = m;
      stats.median = quantile(sorted, 0.5);
      stats.stdDev = stdDev(nums, m);
      stats.q1 = q1;
      stats.q3 = q3;
      stats.outliers = nums.filter((n) => n < low || n > high).length;
    }
  }

  if (type === "string" || type === "boolean" || type === "mixed") {
    const freq = new Map<string, number>();
    for (const v of nonMissing) {
      const k = String(v).trim();
      freq.set(k, (freq.get(k) || 0) + 1);
    }
    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
    stats.topValues = sorted.slice(0, 5).map(([value, count]) => ({
      value,
      count,
      pct: (count / nonMissing.length) * 100,
    }));
    if (type === "string") {
      const lens = nonMissing.map((v) => String(v).length);
      stats.avgLength = lens.length ? mean(lens) : 0;
    }
  }

  if (type === "date") {
    const dates = nonMissing.map(toDate).filter((d): d is Date => d !== null);
    if (dates.length > 0) {
      const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
      stats.minDate = sorted[0].toISOString().slice(0, 10);
      stats.maxDate = sorted[sorted.length - 1].toISOString().slice(0, 10);
    }
  }

  return stats;
}

export function analyze(
  rows: Record<string, unknown>[],
  fileName = "pasted data"
): AnalysisResult {
  if (rows.length === 0) {
    return {
      fileName,
      rows: 0,
      cols: 0,
      missingCells: 0,
      missingPct: 0,
      duplicateRows: 0,
      columns: [],
      issues: [
        {
          severity: "high",
          title: "Empty dataset",
          detail: "No rows were found in the file.",
        },
      ],
      sample: [],
      generatedAt: new Date().toISOString(),
    };
  }

  // Column list from first row's keys union with all rows (preserves order)
  const colSet = new Set<string>();
  for (const r of rows) for (const k of Object.keys(r)) colSet.add(k);
  const cols = [...colSet];

  const columns = cols.map((c) =>
    analyzeColumn(
      c,
      rows.map((r) => r[c])
    )
  );

  const missingCells = columns.reduce((a, c) => a + c.missing, 0);
  const totalCells = rows.length * cols.length;
  const missingPct = totalCells ? (missingCells / totalCells) * 100 : 0;

  // Duplicate rows (exact match on stringified key order)
  const seen = new Map<string, number>();
  for (const r of rows) {
    const key = cols.map((c) => String(r[c] ?? "")).join("\u0001");
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  let duplicateRows = 0;
  for (const n of seen.values()) if (n > 1) duplicateRows += n - 1;

  // Build issues
  const issues: Issue[] = [];
  for (const c of columns) {
    if (c.missingPct >= 50) {
      issues.push({
        severity: "high",
        column: c.name,
        title: `“${c.name}” is mostly empty`,
        detail: `${c.missingPct.toFixed(1)}% of values are missing. Consider dropping this column or filling it.`,
      });
    } else if (c.missingPct >= 10) {
      issues.push({
        severity: "medium",
        column: c.name,
        title: `Missing values in “${c.name}”`,
        detail: `${c.missing.toLocaleString()} of ${c.total.toLocaleString()} values are missing (${c.missingPct.toFixed(1)}%).`,
      });
    }
    if (c.type === "mixed") {
      issues.push({
        severity: "medium",
        column: c.name,
        title: `Mixed types in “${c.name}”`,
        detail: `This column contains more than one kind of value: ${Object.entries(
          c.typeBreakdown || {}
        )
          .map(([k, v]) => `${k} (${v})`)
          .join(", ")}.`,
      });
    }
    if (c.type === "number" && c.outliers && c.outliers > 0) {
      issues.push({
        severity: "low",
        column: c.name,
        title: `${c.outliers} possible outlier${c.outliers > 1 ? "s" : ""} in “${c.name}”`,
        detail: `Values outside 1.5× the interquartile range. Worth a quick look.`,
      });
    }
    if (c.unique === 1 && c.total > 1) {
      issues.push({
        severity: "low",
        column: c.name,
        title: `“${c.name}” has only one unique value`,
        detail: `Every row has the same value. The column may be redundant.`,
      });
    }
    if (c.type === "string" && c.uniquePct > 95 && c.total > 20) {
      issues.push({
        severity: "low",
        column: c.name,
        title: `“${c.name}” looks like an identifier`,
        detail: `Almost every value is unique (${c.uniquePct.toFixed(1)}%). Likely an ID or free-text field.`,
      });
    }
  }
  if (duplicateRows > 0) {
    issues.push({
      severity: duplicateRows > rows.length * 0.05 ? "high" : "medium",
      title: `${duplicateRows.toLocaleString()} duplicate row${duplicateRows > 1 ? "s" : ""}`,
      detail: `Rows that match another row exactly in every column.`,
    });
  }

  issues.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return {
    fileName,
    rows: rows.length,
    cols: cols.length,
    missingCells,
    missingPct,
    duplicateRows,
    columns,
    issues,
    sample: rows.slice(0, 10),
    generatedAt: new Date().toISOString(),
  };
}
