import type { Metadata } from "next";
import AnalyzeClient from "@/components/AnalyzeClient";

export const metadata: Metadata = {
  title: "Analyze",
  description:
    "Upload a CSV or Excel file, paste a table, or use the sample dataset. See column types, missing values, duplicates, outliers, and summary statistics in seconds.",
};

export default function AnalyzePage() {
  return <AnalyzeClient />;
}
