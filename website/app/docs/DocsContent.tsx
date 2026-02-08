import React from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import type { DocFrontmatter } from "./utils";
import type { DocPage } from "./docsConfig";

export default function DocsContent({
  frontmatter,
  body,
  prev,
  next,
}: {
  frontmatter: DocFrontmatter;
  body: string;
  prev: DocPage | null;
  next: DocPage | null;
}) {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
      {/* Page description */}
      {frontmatter.description && (
        <p className="text-slate-400 text-lg mb-2">{frontmatter.description}</p>
      )}

      {/* Markdown content */}
      <article className="max-w-none">
        <Markdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl lg:text-4xl font-bold text-white mt-0 mb-6">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold text-white mt-12 mb-4 pb-2 border-b border-slate-800/50">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-white mt-8 mb-3">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-lg font-semibold text-white mt-6 mb-2">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-slate-300 leading-relaxed my-4">{children}</p>
            ),
            a: ({ href, children }) => {
              if (href?.startsWith("/")) {
                return (
                  <Link
                    href={href}
                    className="text-red-400 hover:text-red-300 hover:underline transition-colors cursor-pointer"
                  >
                    {children}
                  </Link>
                );
              }
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 hover:underline transition-colors cursor-pointer"
                >
                  {children}
                </a>
              );
            },
            ul: ({ children }) => (
              <ul className="my-4 list-disc list-outside ml-6 space-y-1.5">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="my-4 list-decimal list-outside ml-6 space-y-1.5">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-slate-300 leading-relaxed">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-red-500/50 bg-red-500/5 rounded-r-lg px-4 py-3 my-6 [&>p]:my-1">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 rounded-lg border border-slate-800">
                <table className="w-full text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-slate-900/80 border-b border-slate-700">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-slate-300 border-b border-slate-800/50">
                {children}
              </td>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-slate-800/30 transition-colors">
                {children}
              </tr>
            ),
            pre: ({ children }) => (
              <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto my-6 text-sm">
                {children}
              </pre>
            ),
            code: ({ children, className }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="text-red-400 bg-slate-800 px-1.5 py-0.5 rounded text-sm">
                    {children}
                  </code>
                );
              }
              return (
                <code className="text-sm text-slate-300">{children}</code>
              );
            },
            hr: () => <hr className="border-slate-800 my-8" />,
            strong: ({ children }) => (
              <strong className="text-white font-semibold">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="text-slate-200 italic">{children}</em>
            ),
          }}
        >
          {body}
        </Markdown>
      </article>

      {/* Prev / Next navigation */}
      {(prev || next) && (
        <nav className="flex items-center justify-between mt-16 pt-8 border-t border-slate-800/50">
          {prev ? (
            <Link
              href={prev.slug === "" ? "/docs" : `/docs/${prev.slug}`}
              className="group flex flex-col items-start gap-1 cursor-pointer"
            >
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                Previous
              </span>
              <span className="text-sm text-slate-400 group-hover:text-red-400 transition-colors flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={next.slug === "" ? "/docs" : `/docs/${next.slug}`}
              className="group flex flex-col items-end gap-1 cursor-pointer"
            >
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                Next
              </span>
              <span className="text-sm text-slate-400 group-hover:text-red-400 transition-colors flex items-center gap-1">
                {next.title}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      )}
    </div>
  );
}
