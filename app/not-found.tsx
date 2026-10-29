import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for isn't here.",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-prose px-5 sm:px-8 py-24 sm:py-32 text-center">
      <p className="num text-[11px] uppercase tracking-widest text-faint mb-6">
        404
      </p>
      <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter leading-[1.05]">
        That page isn&apos;t here.
      </h1>
      <p className="mt-5 text-[15px] text-muted leading-relaxed">
        The link may be out of date, or the page may have moved. Nothing is
        broken on your end.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-canvas rounded-md text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={14} />
          Back home
        </Link>
        <Link
          href="/analyze"
          className="text-[13px] font-medium text-muted hover:text-ink border-b border-transparent hover:border-ink pb-0.5 transition-all"
        >
          Open the analyzer
        </Link>
      </div>
    </div>
  );
}
