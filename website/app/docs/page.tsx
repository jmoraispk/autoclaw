import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { preprocessMarkdown } from "./utils";
import { getPrevNextPages } from "./docsConfig";
import DocsContent from "./DocsContent";

export default async function DocsIndexPage() {
  const filePath = path.join(process.cwd(), "content", "docs", "index.md");

  let content: string;
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch {
    notFound();
  }

  const { frontmatter, body } = preprocessMarkdown(content);
  const { prev, next } = getPrevNextPages("");

  return <DocsContent frontmatter={frontmatter} body={body} prev={prev} next={next} />;
}
