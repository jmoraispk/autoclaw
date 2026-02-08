"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { docsNavigation } from "./docsConfig";

export default function DocsSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(slug: string) {
    const href = slug === "" ? "/docs" : `/docs/${slug}`;
    return pathname === href;
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
        aria-label="Toggle docs navigation"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 lg:left-auto z-40 lg:z-auto
          h-screen w-64 shrink-0
          bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-xl
          border-r border-slate-800/50
          transition-transform duration-300 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="flex flex-col h-full">
          {/* Back to site link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors px-5 pt-8 pb-2 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
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
            Back to site
          </Link>

          {/* Title */}
          <div className="px-5 pb-4 pt-2">
            <h2 className="text-lg font-bold text-white">Documentation</h2>
          </div>

          {/* Navigation groups */}
          <div className="flex-1 overflow-y-auto px-3 pb-8 space-y-6">
            {docsNavigation.map((group) => (
              <div key={group.group}>
                <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                  {group.group}
                </h3>
                <ul className="space-y-0.5">
                  {group.pages.map((page) => {
                    const href =
                      page.slug === "" ? "/docs" : `/docs/${page.slug}`;
                    const active = isActive(page.slug);
                    return (
                      <li key={page.slug || "index"}>
                        <Link
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className={`block px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                            active
                              ? "text-red-400 bg-red-500/10 font-medium"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                          }`}
                        >
                          {page.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
