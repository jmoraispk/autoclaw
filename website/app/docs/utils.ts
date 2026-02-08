export interface DocFrontmatter {
  title: string;
  description: string;
}

export function preprocessMarkdown(content: string): {
  frontmatter: DocFrontmatter;
  body: string;
} {
  // Extract and strip YAML frontmatter
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  let title = "";
  let description = "";
  let body = content;

  if (frontmatterMatch) {
    const fm = frontmatterMatch[1];
    title = fm.match(/title:\s*"(.+?)"/)?.[1] || "";
    description = fm.match(/description:\s*"(.+?)"/)?.[1] || "";
    body = content.slice(frontmatterMatch[0].length);
  }

  // Convert <CardGroup>/<Card> blocks to markdown link lists
  body = body.replace(
    /<CardGroup[^>]*>([\s\S]*?)<\/CardGroup>/g,
    (_: string, inner: string) => {
      const cards: string[] = [];
      const cardRegex =
        /<Card\s+title="([^"]*)"[^>]*href="([^"]*)"[^>]*>\s*([\s\S]*?)\s*<\/Card>/g;
      let match;
      while ((match = cardRegex.exec(inner)) !== null) {
        cards.push(`- [**${match[1]}**](${match[2]}) — ${match[3].trim()}`);
      }
      return cards.join("\n");
    }
  );

  // Convert <Note> blocks to blockquotes
  body = body.replace(
    /<Note>\s*([\s\S]*?)\s*<\/Note>/g,
    (_: string, inner: string) => `> **Note:** ${inner.trim()}`
  );

  // Convert <Warning> blocks to blockquotes
  body = body.replace(
    /<Warning>\s*([\s\S]*?)\s*<\/Warning>/g,
    (_: string, inner: string) => `> **Warning:** ${inner.trim()}`
  );

  // Fix internal doc links: ](/path) → ](/docs/path)
  // Only fix markdown links starting with / that don't already have /docs/
  body = body.replace(/\]\(\/((?!docs\/)[^)]*)\)/g, "](/docs/$1)");

  return {
    frontmatter: { title, description },
    body,
  };
}
