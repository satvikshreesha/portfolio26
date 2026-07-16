"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { CaseStudiesMetrics } from "@/components/case-studies/CaseStudySection";
import type { HeroIntroMetrics } from "@/components/hero/HeroIntro";

export type SiteMetrics = {
  hero: HeroIntroMetrics;
  caseStudies: CaseStudiesMetrics;
};

const SiteMetricsContext = createContext<SiteMetrics | null>(null);

export function SiteMetricsProvider({
  children,
  metrics,
}: {
  children: ReactNode;
  metrics: SiteMetrics;
}) {
  return (
    <SiteMetricsContext.Provider value={metrics}>{children}</SiteMetricsContext.Provider>
  );
}

export function useSiteMetrics() {
  const metrics = useContext(SiteMetricsContext);

  if (!metrics) {
    throw new Error("useSiteMetrics must be used within SiteMetricsProvider.");
  }

  return metrics;
}
