import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-page px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-2">
            <Link href="/" className="flex items-center gap-2" aria-label="Datalens home">
              <Logo />
              <span className="font-medium tracking-tighter text-[15px]">Datalens</span>
            </Link>
            <p className="mt-3 text-[13px] text-muted max-w-xs leading-relaxed">
              A quiet, careful way to profile a spreadsheet before you trust it.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-faint mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link href="/analyze" className="text-muted hover:text-ink transition-colors">
                  Analyze a file
                </Link>
              </li>
              <li>
                <Link href="/analyze?sample=1" className="text-muted hover:text-ink transition-colors">
                  Try sample data
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-ink transition-colors">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-widest text-faint mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-[13px]">
              <li>
                <a
                  href="mailto:hello@datalens.app"
                  className="text-muted hover:text-ink transition-colors"
                >
                  hello@datalens.app
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-muted hover:text-ink transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-ink transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-faint">
          <p>© {year} Datalens. All rights reserved.</p>
          <p className="num">Files are processed in your browser — nothing is uploaded.</p>
        </div>
      </div>
    </footer>
  );
}
