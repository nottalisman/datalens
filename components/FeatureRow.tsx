import { ReactNode } from "react";

export default function FeatureRow({
  number,
  icon,
  title,
  body,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="num text-[11px] text-faint tracking-widest">
          {number}
        </span>
        <span className="text-muted">{icon}</span>
      </div>
      <h3 className="text-lg font-medium tracking-tighter mb-2">{title}</h3>
      <p className="text-[14px] text-muted leading-relaxed">{body}</p>
    </div>
  );
}
