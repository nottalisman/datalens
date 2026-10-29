# Datalens

A quiet, careful way to profile a spreadsheet before you trust it. Upload a CSV or Excel file and get rows, column types, missing values, duplicates, outliers, and a downloadable report — all in your browser.

## Stack

- Next.js 14 (App Router) · TypeScript
- Tailwind CSS
- Motion (React) for animation
- Papaparse (CSV) · SheetJS/xlsx (Excel)
- Recharts for the mini charts
- Lucide icons

Everything runs client-side. No API routes, no uploads, no accounts.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Vercel detects Next.js. Hit **Deploy**. No env vars needed.

Or deploy from the CLI:

```bash
npm i -g vercel
vercel
```

## Project layout

```
app/
  layout.tsx          Root layout, metadata, nav, footer
  page.tsx            Landing
  analyze/page.tsx    Upload + analysis flow
  about/              About page
  privacy/            Privacy policy
  terms/              Terms
  not-found.tsx       Custom 404
  icon.svg            Favicon
  sitemap.ts          /sitemap.xml
  globals.css         Base styles + theme vars
components/           UI building blocks
lib/
  analyze.ts          Column profiling, issue detection
  parse.ts            CSV / XLSX / pasted-text parsing
  report.ts           Markdown + JSON report generation
  sample.ts           The demo dataset
public/
  favicon.svg
  robots.txt
```

## Notes on the analysis

- **Type inference** per column: `number`, `string`, `date`, `boolean`, `mixed`, `empty`. A column needs 95% of its non-missing values to agree on a type, else it's `mixed`.
- **Missing** counts null/undefined, empty strings, and common sentinels (`N/A`, `nan`, `-`, `?`, `#N/A`, etc.).
- **Outliers** on numeric columns use the 1.5·IQR rule.
- **Duplicates** are exact matches across all columns.
- **Issues** are ranked high → low and shown in order.

## License

MIT — do whatever you like.
