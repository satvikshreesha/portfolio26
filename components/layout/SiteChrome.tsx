"use client";

import { useDialKit } from "dialkit";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { CaseStudiesMetrics } from "@/components/case-studies/CaseStudySection";
import { TileGrid } from "@/components/grid/TileGrid";
import type { HeroIntroMetrics } from "@/components/hero/HeroIntro";
import { SiteMetricsProvider } from "@/components/layout/SiteMetricsContext";
import { TopNav, type TopNavMetrics } from "@/components/nav/TopNav";
import { GRID_MIN_ROWS, TILE_SIZE } from "@/lib/constants";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const dials = useDialKit(
    "Navbar",
    {
      Padding: {
        navBarY: [7, 0, 16, 1],
        outerShell: [2.75, 0, 10, 0.25],
        innerCapsuleY: [5.25, 0, 14, 0.25],
        itemY: [3.5, 0, 12, 0.25],
      },
      activeHighlightMotion: true,
      svkHomeMark: true,
    },
    {
      id: "navbar",
      persist: true,
    },
  );

  const tileSize = TILE_SIZE;
  const lineHeight = tileSize * 0.49;
  const navHeight =
    lineHeight +
    dials.Padding.itemY * 2 +
    dials.Padding.innerCapsuleY * 2 +
    dials.Padding.outerShell * 2 +
    dials.Padding.navBarY * 2;
  const isWorkRoute = pathname === "/";
  const viewportRows = Math.max(1, Math.ceil(Math.max(viewportHeight - navHeight, 0) / tileSize));

  const navMetrics: TopNavMetrics = {
    tileSize,
    navHeight,
    pageInset: tileSize * 3,
    groupGap: tileSize,
    navPaddingY: dials.Padding.navBarY,
    outerPadding: dials.Padding.outerShell,
    innerPaddingY: dials.Padding.innerCapsuleY,
    innerPaddingX: tileSize * 0.59,
    itemPaddingY: dials.Padding.itemY,
    itemPaddingX: tileSize * 0.29,
    capsuleGap: tileSize * 1.27,
    tldrGap: tileSize * 1.56,
    fontSize: tileSize * 0.39,
    lineHeight,
    fontWeight: 500,
  };
  const heroMetrics: HeroIntroMetrics = {
    tileSize,
    left: navMetrics.pageInset,
    top: navHeight + tileSize * 2.25,
    bodyLineOffset: tileSize * 0.25,
    roleLineOffset: tileSize * 0.15,
  };
  const caseStudiesMetrics: CaseStudiesMetrics = {
    tileSize,
    left: navMetrics.pageInset,
    top: navHeight + tileSize * 9,
    cardWidth: tileSize * 17.31,
    imageHeight: tileSize * 10.49,
    rowGap: tileSize * 1.46,
  };
  const autoRows = Math.max(
    1,
    Math.ceil(
      Math.max(contentHeight - navHeight, viewportHeight - navHeight, 0) / tileSize,
    ),
  );
  const gridRows = Math.max(autoRows, viewportRows, GRID_MIN_ROWS);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return;
    }

    const updateContentHeight = () => {
      setContentHeight(Math.max(element.scrollHeight, document.documentElement.scrollHeight));
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };

    updateContentHeight();

    const observer = new ResizeObserver(updateContentHeight);
    observer.observe(element);
    window.addEventListener("resize", updateContentHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateContentHeight);
    };
  }, [navHeight, pathname, tileSize]);

  return (
    <>
      <TopNav
        activeHighlightMotion={dials.activeHighlightMotion}
        metrics={navMetrics}
        svkHomeMark={dials.svkHomeMark}
      />
      <TileGrid
        fadeEnabled={isWorkRoute}
        navHeight={navHeight}
        rows={gridRows}
        tileSize={tileSize}
        viewportWidth={viewportWidth}
      />
      <SiteMetricsProvider metrics={{ caseStudies: caseStudiesMetrics, hero: heroMetrics }}>
        <main className="relative z-10 pointer-events-none">
          <div
            className="pointer-events-auto"
            ref={contentRef}
            style={{ position: "relative", zIndex: 10 }}
          >
            {children}
          </div>
        </main>
      </SiteMetricsProvider>
    </>
  );
}
