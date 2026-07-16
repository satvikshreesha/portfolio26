"use client";

import { CaseStudiesStack } from "@/components/case-studies/CaseStudySection";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { useSiteMetrics } from "@/components/layout/SiteMetricsContext";
import { caseStudies } from "@/data/caseStudies";

export function WorkPage() {
  const metrics = useSiteMetrics();

  return (
    <>
      <HeroIntro metrics={metrics.hero} />
      <CaseStudiesStack caseStudies={caseStudies} metrics={metrics.caseStudies} />
    </>
  );
}
