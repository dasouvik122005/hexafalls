"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

export default function CodeOfConductBody() {
  const [html, setHtml] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/docs/code-of-conduct.md", { cache: "force-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((md) => {
        if (cancelled) return;
        setHtml(marked.parse(md));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p className="font-wizard italic text-silver-hp/60 text-center">
        The scroll could not be unfurled. Please reload, or read it on{" "}
        <a
          href="https://github.com/hexafest/hexafalls/blob/main/CODE_OF_CONDUCT.md"
          className="underline text-cyan-hp"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    );
  }

  if (!html) {
    return (
      <p className="font-wizard italic text-silver-hp/50 text-center">
        Unfurling the scroll…
      </p>
    );
  }

  return (
    <article className="coc-prose" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
