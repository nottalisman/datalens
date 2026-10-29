export default function SampleTable({
  rows,
  columns,
}: {
  rows: Record<string, unknown>[];
  columns: string[];
}) {
  if (rows.length === 0) {
    return (
      <div className="border border-border rounded-lg bg-surface py-10 text-center text-[13px] text-muted">
        No rows to preview.
      </div>
    );
  }
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-subtle/60">
              {columns.map((c) => (
                <th
                  key={c}
                  className="text-left px-3 py-2 font-medium text-muted whitespace-nowrap"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-b-0">
                {columns.map((c) => {
                  const v = r[c];
                  const isMissing =
                    v === null ||
                    v === undefined ||
                    (typeof v === "string" && v.trim() === "");
                  return (
                    <td
                      key={c}
                      className={`px-3 py-2 whitespace-nowrap ${
                        isMissing
                          ? "text-faint italic"
                          : "text-ink num"
                      } ${
                        typeof v === "string" && !isMissing ? "font-sans" : ""
                      }`}
                    >
                      {isMissing ? "—" : String(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
