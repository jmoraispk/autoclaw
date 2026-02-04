import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import posts from "../posts.json";

type PostData = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
};

const postsData: Record<string, PostData> = posts;

export function generateStaticParams() {
  return Object.keys(postsData).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postsData[slug];

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-slate-400 hover:text-red-400 transition-colors mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm mb-4">
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 font-medium border border-red-500/20">
              {post.category}
            </span>
            <span className="text-slate-500">{post.date}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">{post.readTime}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-slate-300 prose-strong:text-white prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline prose-code:text-red-400 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-li:text-slate-300 prose-ol:text-slate-300 prose-ul:text-slate-300">
          {post.content.split("\n\n").map((paragraph, idx) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={idx} className="text-2xl font-bold text-white mt-10 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-xl font-bold text-white mt-8 mb-3">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("```")) {
              const lines = paragraph.split("\n");
              const code = lines.slice(1, -1).join("\n");
              return (
                <pre key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto my-6">
                  <code className="text-sm text-slate-300">{code}</code>
                </pre>
              );
            }
            if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
              const items = paragraph.split("\n");
              const isOrdered = paragraph.startsWith("1. ");
              const ListTag = isOrdered ? "ol" : "ul";
              return (
                <ListTag key={idx} className={`my-4 ${isOrdered ? "list-decimal" : "list-disc"} list-inside space-y-2`}>
                  {items.map((item, i) => (
                    <li key={i} className="text-slate-300">
                      {item.replace(/^(\d+\.\s|-\s)/, "")}
                    </li>
                  ))}
                </ListTag>
              );
            }
            return (
              <p key={idx} className="text-slate-300 leading-relaxed my-4">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* Horizontal Line */}
        <div className="mt-16 pt-8 border-t border-slate-800"></div>
      </div>
    </main>
  );
}
