import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { marked } from "marked";

export const metadata = {
  title: "Code of Conduct · HexaFalls Techfest",
  description:
    "How we behave at HexaFalls — pledge, expected standards, scope, reporting, and enforcement.",
};

// Static page; cache the rendered HTML across requests.
export const dynamic = "force-static";
export const revalidate = false;

export default async function CodeOfConductPage() {
  const md = await fs.readFile(
    path.join(process.cwd(), "CODE_OF_CONDUCT.md"),
    "utf8"
  );
  marked.setOptions({ gfm: true, breaks: false, headerIds: true });
  const html = marked.parse(md);

  return (
    <main className="min-h-screen bg-midnight text-silver-hp/85 font-body">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-silver-hp/60 hover:text-silver-hp transition mb-10"
        >
          ← Back
        </Link>
        <article
          className="coc-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </main>
  );
}
