export default function StatTile({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "warn";
}) {
  return (
    <div className="border border-border rounded-lg bg-surface p-4">
      <p className="text-[11px] uppercase tracking-widest text-faint">
        {label}
      </p>
      <p
        className={`num text-2xl mt-1 font-medium tracking-tighter ${
          tone === "warn" ? "text-warn" : "text-ink"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-muted mt-1">{sub}</p>}
    </div>
  );
}
