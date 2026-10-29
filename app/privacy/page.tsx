import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Datalens does and does not do with your data. Short version: nothing leaves your browser.",
};

export default function Privacy() {
  const year = new Date().getFullYear();
  return (
    <article className="mx-auto max-w-prose px-5 sm:px-8 pt-16 sm:pt-24 pb-24">
      <p className="text-[11px] uppercase tracking-widest text-faint mb-5">
        Privacy
      </p>
      <h1 className="text-3xl sm:text-4xl font-medium tracking-tighter leading-[1.1]">
        Your file stays on your machine.
      </h1>
      <p className="mt-4 text-[13px] text-faint">Last updated {year}.</p>

      <div className="mt-10 text-[15px] leading-[1.75] space-y-5">
        <p>
          Datalens is a client-side tool. When you upload or paste a file,
          parsing and analysis happen entirely in your browser using JavaScript
          loaded from this page. The file&apos;s contents are never transmitted
          to our servers or to any third party.
        </p>
        <h2 className="text-lg font-medium tracking-tighter mt-10">
          What we don&apos;t collect
        </h2>
        <ul className="list-disc pl-5 space-y-1 marker:text-faint">
          <li>Your files — in whole, in part, or as a hash.</li>
          <li>Your column names or any derived values.</li>
          <li>Account information. There are no accounts.</li>
        </ul>
        <h2 className="text-lg font-medium tracking-tighter mt-10">
          What we do collect
        </h2>
        <ul className="list-disc pl-5 space-y-1 marker:text-faint">
          <li>
            Standard server logs (IP, user agent) from the hosting provider,
            retained for a limited period for security.
          </li>
          <li>
            Anonymous page-view counts, if we add analytics in the future. No
            cookies are set today.
          </li>
        </ul>
        <h2 className="text-lg font-medium tracking-tighter mt-10">
          Contact
        </h2>
        <p>
          Questions about this policy go to{" "}
          <a
            href="mailto:hello@datalens.app"
            className="border-b border-ink pb-0.5"
          >
            hello@datalens.app
          </a>
          .
        </p>
      </div>
    </article>
  );
}
