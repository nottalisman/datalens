"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";

const links = [
  { href: "/analyze", label: "Analyze" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
          scrolled
            ? "bg-canvas/80 backdrop-blur border-b border-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-page px-5 sm:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Datalens home"
            >
              <Logo />
              <span className="font-medium tracking-tighter text-[15px]">
                Datalens
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                    pathname === l.href
                      ? "text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/analyze"
                className="ml-2 px-4 py-1.5 text-[13px] font-medium bg-ink text-canvas rounded-md hover:opacity-90 transition-opacity"
              >
                Start analyzing
              </Link>
            </nav>

            <button
              type="button"
              className="md:hidden p-2 -mr-2 rounded-md hover:bg-subtle transition-colors"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-16 z-30 bg-canvas md:hidden"
          >
            <motion.nav
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="px-5 py-8 flex flex-col gap-1"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-3 text-xl font-medium tracking-tighter border-b border-border"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/analyze"
                className="mt-6 py-3 px-4 text-center bg-ink text-canvas rounded-md font-medium"
              >
                Start analyzing
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
