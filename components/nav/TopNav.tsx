"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

export type TopNavMetrics = {
  tileSize: number;
  navHeight: number;
  pageInset: number;
  groupGap: number;
  navPaddingY: number;
  outerPadding: number;
  innerPaddingY: number;
  innerPaddingX: number;
  itemPaddingY: number;
  itemPaddingX: number;
  capsuleGap: number;
  tldrGap: number;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
};

type TopNavProps = {
  activeHighlightMotion: boolean;
  metrics: TopNavMetrics;
  svkHomeMark: boolean;
};

const primaryNavItems = [
  { label: "Work", href: "/" },
  { label: "Lab", href: "/lab" },
  { label: "Me", href: "/me" },
];

function getNavLinkStyle(metrics: TopNavMetrics) {
  return {
    boxSizing: "border-box",
    color: "var(--muted)",
    flexShrink: 0,
    fontFamily: "var(--font-mono)",
    fontSize: metrics.fontSize,
    fontWeight: metrics.fontWeight,
    lineHeight: `${metrics.lineHeight}px`,
    textDecoration: "none",
    width: "max-content",
  } satisfies CSSProperties;
}

function getNavItemTextStyle(metrics: TopNavMetrics, active = false) {
  return {
    boxSizing: "border-box",
    color: active
      ? "var(--text-nav-active)"
      : "var(--primary-nav-link-color, var(--text-nav))",
    flexShrink: 0,
    fontFamily: "var(--font-mono)",
    fontSize: metrics.fontSize,
    fontWeight: metrics.fontWeight,
    lineHeight: `${metrics.lineHeight}px`,
    width: "max-content",
  } satisfies CSSProperties;
}

function getPrimaryNavItemStyle(metrics: TopNavMetrics) {
  return {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    gap: metrics.tileSize * 0.17,
    justifyContent: "center",
    paddingBlock: metrics.itemPaddingY,
    paddingInline: metrics.itemPaddingX,
    position: "relative",
    textDecoration: "none",
  } satisfies CSSProperties;
}

function getRaisedShellStyle(metrics: TopNavMetrics) {
  return {
    alignItems: "start",
    backgroundColor: "var(--surface-raised)",
    borderRadius: metrics.tileSize * 0.27,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: metrics.tileSize * 0.2,
    outline: "2px solid var(--hairline)",
    padding: metrics.outerPadding,
  } satisfies CSSProperties;
}

function getInnerCapsuleStyle(metrics: TopNavMetrics) {
  return {
    alignItems: "center",
    backgroundColor: "var(--surface-raised)",
    borderRadius: metrics.tileSize * 0.2,
    boxSizing: "border-box",
    display: "flex",
    outline: "1px solid var(--border-raised)",
    paddingBlock: metrics.innerPaddingY,
    paddingInline: metrics.innerPaddingX,
  } satisfies CSSProperties;
}

function usePacificTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

      setTime(`${formatted} PST`);
    };

    format();
    const intervalId = window.setInterval(format, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return time;
}

export function TopNav({ activeHighlightMotion, metrics, svkHomeMark }: TopNavProps) {
  const pathname = usePathname();
  const [pendingRoute, setPendingRoute] = useState<{ from: string; href: string } | null>(null);
  const pacificTime = usePacificTime();
  const shouldReduceMotion = useReducedMotion();
  const activeHref = pendingRoute?.from === pathname ? pendingRoute.href : pathname;
  const navLinkStyle = getNavLinkStyle(metrics);
  const raisedShellStyle = getRaisedShellStyle(metrics);
  const innerCapsuleStyle = getInnerCapsuleStyle(metrics);
  const primaryNavItemStyle = getPrimaryNavItemStyle(metrics);
  const iconSize = metrics.tileSize * 0.49;
  const iconSquareSize = metrics.tileSize * 0.34;
  const iconSquareOffset = metrics.tileSize * 0.15;
  const highlightTransition =
    activeHighlightMotion && !shouldReduceMotion
      ? { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.7 }
      : { duration: 0 };

  return (
    <nav
      aria-label="Primary"
      id="top"
      style={{
        alignItems: "center",
        backgroundColor: "var(--background)",
        boxSizing: "border-box",
        display: "flex",
        fontSynthesis: "none",
        gap: metrics.groupGap,
        height: metrics.navHeight,
        justifyContent: "space-between",
        left: 0,
        MozOsxFontSmoothing: "grayscale",
        outline: "2px solid var(--hairline)",
        paddingBlock: metrics.navPaddingY,
        paddingInline: metrics.pageInset,
        position: "fixed",
        top: 0,
        WebkitFontSmoothing: "antialiased",
        width: "100%",
        zIndex: 20,
      }}
    >
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: metrics.groupGap,
        }}
      >
        <div style={{ ...raisedShellStyle, boxShadow: "var(--shadow-float)" }}>
          <div style={{ ...innerCapsuleStyle, gap: metrics.capsuleGap }}>
            <Link
              aria-label="Home"
              href="/"
              style={{
                alignItems: "center",
                boxSizing: "border-box",
                color: "var(--text-nav)",
                display: "flex",
                flexShrink: 0,
                fontFamily: "var(--font-sans)",
                fontSize: metrics.fontSize,
                fontWeight: 600,
                height: svkHomeMark ? metrics.lineHeight : iconSize,
                lineHeight: `${metrics.lineHeight}px`,
                position: "relative",
                textDecoration: "none",
                width: svkHomeMark ? "max-content" : iconSize,
              }}
            >
              {svkHomeMark ? (
                <span aria-hidden="true">SVK</span>
              ) : (
                <>
                  <span
                    aria-hidden="true"
                    style={{
                      backgroundColor: "var(--text-nav)",
                      boxSizing: "border-box",
                      height: iconSquareSize,
                      left: 0,
                      position: "absolute",
                      top: 0,
                      width: iconSquareSize,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      backgroundColor: "var(--text-nav)",
                      boxSizing: "border-box",
                      height: iconSquareSize,
                      left: iconSquareOffset,
                      position: "absolute",
                      top: iconSquareOffset,
                      width: iconSquareSize,
                    }}
                  />
                </>
              )}
            </Link>
            {primaryNavItems.map((item) => {
              const active = activeHref === item.href;

              return (
                <Link
                  className="primary-nav-link"
                  href={item.href}
                  key={item.href}
                  onClick={() => setPendingRoute({ from: pathname, href: item.href })}
                  style={primaryNavItemStyle}
                >
                  {active ? (
                    <motion.span
                      aria-hidden="true"
                      layoutId="primary-nav-active-highlight"
                      style={{
                        backgroundColor: "var(--hairline)",
                        inset: 0,
                        position: "absolute",
                        zIndex: 0,
                      }}
                      transition={highlightTransition}
                    />
                  ) : null}
                  <span
                    style={{
                      ...getNavItemTextStyle(metrics, active),
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <a
          className="nav-social-link"
          href="https://www.linkedin.com/in/satvik-shreesha/"
          rel="noreferrer"
          style={navLinkStyle}
          target="_blank"
        >
          LinkedIn
        </a>
        <a
          className="nav-social-link"
          href="https://x.com/SatvikShreesha"
          rel="noreferrer"
          style={navLinkStyle}
          target="_blank"
        >
          X
        </a>
      </div>
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: metrics.groupGap,
        }}
      >
        <div style={navLinkStyle}>SF/Seattle</div>
        <time dateTime={pacificTime} style={navLinkStyle}>
          {pacificTime}
        </time>
        {/* TLDR capsule — re-enable later
        <div style={raisedShellStyle}>
          <div style={{ ...innerCapsuleStyle, gap: metrics.tldrGap }}>
            <a href="#" style={{ ...getNavItemTextStyle(metrics), textDecoration: "none" }}>
              Tldr
            </a>
          </div>
        </div>
        */}
      </div>
    </nav>
  );
}
