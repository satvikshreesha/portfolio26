"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { AboutPhotoField } from "@/components/about/AboutPhotoField";
import { ABOUT_COPY_LINES } from "@/components/about/aboutCopy";
import { MobileAbout } from "@/components/about/MobileAbout";
import { RandomizeButton } from "@/components/about/RandomizeButton";
import { useViewport } from "@/components/about/useViewport";
import { useSiteMetrics } from "@/components/layout/SiteMetricsContext";
import type { AboutGridSize, GridRect } from "@/lib/aboutPhotoGrid";

const MOBILE_BREAKPOINT_PX = 760;

export function AboutPage() {
  const {
    hero: { tileSize, top },
  } = useSiteMetrics();
  const [isShuffling, setIsShuffling] = useState(false);
  const viewport = useViewport();
  const navHeight = top - tileSize * 2.25;
  const isMobile = viewport.width > 0 && viewport.width < MOBILE_BREAKPOINT_PX;
  const fontSize = tileSize * 0.69;
  const lineHeight = tileSize * 0.86;
  const textWidth = Math.min(tileSize * 24, Math.max(tileSize * 9, viewport.width - tileSize * 4));
  const textHeight = ABOUT_COPY_LINES.length * lineHeight;
  const textBottom = navHeight + Math.round(
    (Math.max(viewport.height - navHeight, 0) / 2 + textHeight / 2) / tileSize,
  ) * tileSize;
  const textTop = Math.max(navHeight + tileSize * 2, textBottom - textHeight);
  const textLeft = Math.max(tileSize, (viewport.width - textWidth) / 2);
  const buttonHeight = tileSize * 0.82;
  const buttonWidth = tileSize * 2.95;
  const buttonTop = textBottom + tileSize * 0.72;
  const buttonLeft = textLeft + textWidth / 2 - buttonWidth / 2;
  const introOrigin = useMemo(
    () => ({
      x: textLeft + textWidth / 2,
      y: (textTop + buttonTop + buttonHeight) / 2,
    }),
    [buttonHeight, buttonTop, textLeft, textTop, textWidth],
  );
  const grid = useMemo<AboutGridSize>(
    () => ({
      cols: Math.max(1, Math.floor(Math.max(viewport.width, tileSize) / tileSize)),
      rows: Math.max(1, Math.floor(Math.max(viewport.height - navHeight, tileSize) / tileSize)),
    }),
    [navHeight, tileSize, viewport.height, viewport.width],
  );
  const blockedRects = useMemo(
    () =>
      getBlockedRects({
        buttonHeight,
        buttonLeft,
        buttonTop,
        buttonWidth,
        lineHeight,
        navHeight,
        textLeft,
        textTop,
        textWidth,
        tileSize,
      }),
    [
      buttonHeight,
      buttonLeft,
      buttonTop,
      buttonWidth,
      lineHeight,
      navHeight,
      textLeft,
      textTop,
      textWidth,
      tileSize,
    ],
  );
  const textStyle = {
    color: "var(--hero-foreground)",
    fontFamily: "var(--font-sans)",
    fontSize,
    fontSynthesis: "none",
    fontWeight: 500,
    lineHeight: `${lineHeight}px`,
    margin: 0,
    MozOsxFontSmoothing: "grayscale",
    textAlign: "center",
    WebkitFontSmoothing: "antialiased",
  } satisfies CSSProperties;

  if (isMobile) {
    return (
      <MobileAbout
        fontSize={fontSize}
        lineHeight={lineHeight}
        navHeight={navHeight}
        textStyle={textStyle}
        tileSize={tileSize}
      />
    );
  }

  return (
    <section
      aria-label="About Satvik"
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AboutPhotoField
        blockedRects={blockedRects}
        grid={grid}
        key={`${grid.cols}:${grid.rows}:${blockedRects
          .map((rect) => `${rect.cellI}:${rect.cellJ}:${rect.spanW}:${rect.spanH}`)
          .join("|")}`}
        navHeight={navHeight}
        onShuffleChange={setIsShuffling}
        introOrigin={introOrigin}
        tileSize={tileSize}
      />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: tileSize * 0.72,
          left: textLeft,
          pointerEvents: "auto",
          position: "absolute",
          top: textTop,
          width: textWidth,
          zIndex: 20,
        }}
      >
        <p style={textStyle}>
          {ABOUT_COPY_LINES.map((line) => (
            <span key={line} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </p>
        <RandomizeButton disabled={isShuffling} form="about-photo-randomize" />
      </div>
    </section>
  );
}

function getBlockedRects({
  buttonHeight,
  buttonLeft,
  buttonTop,
  buttonWidth,
  lineHeight,
  navHeight,
  textLeft,
  textTop,
  textWidth,
  tileSize,
}: {
  buttonHeight: number;
  buttonLeft: number;
  buttonTop: number;
  buttonWidth: number;
  lineHeight: number;
  navHeight: number;
  textLeft: number;
  textTop: number;
  textWidth: number;
  tileSize: number;
}): GridRect[] {
  return [
    ...ABOUT_COPY_LINES.map((line, index) => {
      const lineWidth = Math.min(textWidth, estimateLineWidth(line, tileSize));
      const lineLeft = textLeft + textWidth / 2 - lineWidth / 2;

      return rectFromPixels({
        height: lineHeight,
        left: lineLeft,
        navHeight,
        tileSize,
        top: textTop + index * lineHeight,
        width: lineWidth,
      });
    }),
    rectFromPixels({
      height: buttonHeight,
      left: buttonLeft,
      navHeight,
      tileSize,
      top: buttonTop,
      width: buttonWidth,
    }),
  ];
}

function rectFromPixels({
  height,
  left,
  navHeight,
  tileSize,
  top,
  width,
}: {
  height: number;
  left: number;
  navHeight: number;
  tileSize: number;
  top: number;
  width: number;
}): GridRect {
  const cellI = Math.max(0, Math.floor(left / tileSize));
  const cellJ = Math.max(0, Math.floor((top - navHeight) / tileSize));
  const endI = Math.ceil((left + width) / tileSize);
  const endJ = Math.ceil((top + height - navHeight) / tileSize);

  return {
    cellI,
    cellJ,
    spanH: Math.max(1, endJ - cellJ),
    spanW: Math.max(1, endI - cellI),
  };
}

function estimateLineWidth(line: string, tileSize: number) {
  return line.length * tileSize * 0.36;
}

