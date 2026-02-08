import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { preprocessMarkdown } from "../utils";
import { getAllDocSlugs, getPrevNextPages } from "../docsConfig";
import DocsContent from "../DocsContent";

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

async function getDocContent(slugParts: string[]): Promise<string | null> {
  const slugPath = slugParts.join("/");
  const basePath = path.join(process.cwd(), "content", "docs");

  // Try direct file first (e.g., getting-started.md)
  try {
    const directPath = path.join(basePath, `${slugPath}.md`);
    return await fs.readFile(directPath, "utf-8");
  } catch {
    // fall through
  }

  // Try index file in directory (e.g., features/index.md)
  try {
    const indexPath = path.join(basePath, slugPath, "index.md");
    return await fs.readFile(indexPath, "utf-8");
  } catch {
    // fall through
  }

  return null;
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const content = await getDocContent(slug);

  if (!content) {
    notFound();
  }

  const { frontmatter, body } = preprocessMarkdown(content);
  const currentSlug = slug.join("/");
  const { prev, next } = getPrevNextPages(currentSlug);

  return <DocsContent frontmatter={frontmatter} body={body} prev={prev} next={next} />;
}
