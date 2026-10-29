import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://datalens.vercel.app"),
  title: {
    default: "Datalens — Understand your spreadsheets at a glance",
    template: "%s · Datalens",
  },
  description:
    "Upload a CSV or Excel file and get an instant, plain-English readout of your data: missing values, column types, duplicates, outliers, and a downloadable quality report.",
  keywords: [
    "data analysis",
    "csv analyzer",
    "excel analyzer",
    "data quality",
    "data profiling",
    "spreadsheet tool",
  ],
  authors: [{ name: "Datalens" }],
  openGraph: {
    title: "Datalens — Understand your spreadsheets at a glance",
    description:
      "A quiet, careful way to profile a spreadsheet. Upload, connect, or paste — see what your data actually contains.",
    type: "website",
    siteName: "Datalens",
  },
  twitter: {
    card: "summary_large_image",
    title: "Datalens",
    description:
      "A quiet, careful way to profile a spreadsheet. Upload, connect, or paste — see what your data actually contains.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
