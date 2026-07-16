"use client";

import type { CSSProperties } from "react";
import { useSiteMetrics } from "@/components/layout/SiteMetricsContext";

export function SimpleGridPage({
  content,
  title,
}: {
  content: string;
  title: string;
}) {
  const {
    hero: { bodyLineOffset, left, tileSize, top },
  } = useSiteMetrics();
  const fontSize = tileSize * 0.69;
  const lineHeight = tileSize * 0.86;
  const headlineWidth = tileSize * 17.94;
  const textStyle = {
    boxSizing: "border-box",
    color: "var(--hero-foreground)",
    fontFamily: "var(--font-sans)",
    fontSize,
    fontWeight: 500,
    lineHeight: `${lineHeight}px`,
    width: "fit-content",
  } satisfies CSSProperties;

  return (
    <section
      aria-label={title}
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontSynthesis: "none",
        gap: tileSize * 0.46,
        marginLeft: left,
        marginTop: top,
        MozOsxFontSmoothing: "grayscale",
        pointerEvents: "auto",
        position: "relative",
        WebkitFontSmoothing: "antialiased",
        zIndex: 10,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          gap: tileSize * 0.29,
          width: headlineWidth,
        }}
      >
        <h1
          style={{
            ...textStyle,
            fontWeight: 600,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <div
          aria-hidden="true"
          style={{
            backgroundColor: "var(--hero-divider)",
            flexShrink: 0,
            height: 1,
            width: "100%",
          }}
        />
      </div>
      <p
        style={{
          ...textStyle,
          margin: 0,
          transform: `translateY(${bodyLineOffset}px)`,
        }}
      >
        {content}
      </p>
    </section>
  );
}
