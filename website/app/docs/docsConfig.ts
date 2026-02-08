export interface DocPage {
  slug: string;
  title: string;
}

export interface DocGroup {
  group: string;
  pages: DocPage[];
}

export const docsNavigation: DocGroup[] = [
  {
    group: "Getting Started",
    pages: [
      { slug: "", title: "Introduction" },
      { slug: "getting-started", title: "Getting Started" },
      { slug: "how-it-works", title: "How It Works" },
    ],
  },
  {
    group: "Features",
    pages: [
      { slug: "features", title: "Overview" },
      { slug: "features/channels", title: "Chat Channels" },
      { slug: "features/skills", title: "Skills & Integrations" },
    ],
  },
  {
    group: "Platform",
    pages: [
      { slug: "platform/dashboard", title: "Dashboard" },
      { slug: "platform/cost-tracking", title: "Cost Tracking" },
      { slug: "platform/security", title: "Security" },
    ],
  },
  {
    group: "Help",
    pages: [
      { slug: "help/faq", title: "FAQ" },
      { slug: "help/support", title: "Support" },
    ],
  },
];

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [];
  for (const group of docsNavigation) {
    for (const page of group.pages) {
      if (page.slug === "") continue;
      slugs.push(page.slug.split("/"));
    }
  }
  return slugs;
}

export function getPageBySlug(slug: string): DocPage | undefined {
  for (const group of docsNavigation) {
    for (const page of group.pages) {
      if (page.slug === slug) return page;
    }
  }
  return undefined;
}

export function getPrevNextPages(currentSlug: string): {
  prev: DocPage | null;
  next: DocPage | null;
} {
  const allPages: DocPage[] = [];
  for (const group of docsNavigation) {
    for (const page of group.pages) {
      allPages.push(page);
    }
  }

  const idx = allPages.findIndex((p) => p.slug === currentSlug);
  return {
    prev: idx > 0 ? allPages[idx - 1] : null,
    next: idx < allPages.length - 1 ? allPages[idx + 1] : null,
  };
}
