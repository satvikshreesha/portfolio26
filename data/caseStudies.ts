export type CaseStudyProject = {
  title: string;
  slug: string;
};

export type CaseStudy = {
  company: string;
  year: string;
  description: string;
  logoSrc: string;
  slug: string;
  projects: CaseStudyProject[];
};

const CASE_STUDIES_CONTENT_BASE = "/case-studies-content";
const COVER_FILENAME = "studycover.jpg";
// Bump when replacing cover images in place so Next.js image optimizer serves fresh files.
const COVER_CACHE_VERSION = "2026-07-15d";

export function getCaseStudyCoverSrc(caseStudy: CaseStudy, project: CaseStudyProject) {
  return `${CASE_STUDIES_CONTENT_BASE}/${caseStudy.slug}/${project.slug}/${COVER_FILENAME}?v=${COVER_CACHE_VERSION}`;
}

export const caseStudies: CaseStudy[] = [
  {
    company: "Databricks",
    year: "2026",
    description: "Product Design Intern working on growing activation and retention in Genie One-- the all purpose knowledge tool.",
    logoSrc: "/company-logos/databricks.png",
    slug: "databricks",
    projects: [
      {
        title: "[Ongoing] Defining Product Led Growth at Databricks",
        slug: "main-case-study",
      },
      {
        title: "[Ongoing] Connecting external data sources for richer context",
        slug: "connector",
      },
      {
        title: "Encouraging Mobile Adoption",
        slug: "mobile-banner",
      },
    ],
  },
  {
    company: "Observe.AI",
    year: "2025",
    description: "Product Design Intern working on the RealTime Agent Assist.",
    logoSrc: "/company-logos/observe-ai.png",
    slug: "observe-ai",
    projects: [
      {
        title: "Internal Preview tool to diagnose AI Copilot issues",
        slug: "main-case",
      },
      {
        title: "Shaping the vision of the AI Copilot",
        slug: "cards",
      },
    ],
  },
  {
    company: "Alignment.io",
    year: "2024",
    description:
      "Product Design Intern bridging a fragmented quarterly workflow with a unified workspace dashboard.",
    logoSrc: "/company-logos/alignment.png",
    slug: "alignment",
    projects: [
      {
        title: "Bridging disconnected productivity features with a comprehensive dashboard",
        slug: "main-case-study",
      },
    ],
  },
];
