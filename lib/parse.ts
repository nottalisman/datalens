import Papa from "papaparse";

export async function parseCSV(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      dynamicTyping: true,
      transformHeader: (h) => h.trim(),
      complete: (res) => {
        if (res.errors.length && res.data.length === 0) {
          reject(new Error(res.errors[0].message));
          return;
        }
        resolve(res.data);
      },
      error: (err) => reject(err),
    });
  });
}

export async function parseExcel(
  file: File
): Promise<Record<string, unknown>[]> {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];
  const sheet = wb.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: true,
  });
}

export function parsePasted(text: string): Record<string, unknown>[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // Detect delimiter — tab, comma, or semicolon
  const firstLine = trimmed.split(/\r?\n/)[0];
  const tabs = (firstLine.match(/\t/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const semis = (firstLine.match(/;/g) || []).length;
  let delim = ",";
  if (tabs >= commas && tabs >= semis && tabs > 0) delim = "\t";
  else if (semis > commas) delim = ";";

  const res = Papa.parse<Record<string, unknown>>(trimmed, {
    header: true,
    skipEmptyLines: "greedy",
    dynamicTyping: true,
    delimiter: delim,
    transformHeader: (h) => h.trim(),
  });
  return res.data;
}
