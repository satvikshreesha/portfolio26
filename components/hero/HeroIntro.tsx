import type { CSSProperties } from "react";

export type HeroIntroMetrics = {
  tileSize: number;
  left: number;
  top: number;
  bodyLineOffset: number;
  roleLineOffset: number;
};

type HeroIntroProps = {
  metrics: HeroIntroMetrics;
};

const DATABRICKS_MARK =
  "https://app.paper.design/file-assets/01KWXKV4NTE9QGPKY075WQPCF7/57Z8GM8CRPQM87Z4MSZJ5WXDB8.png";
const UOFWA_MARK =
  "https://app.paper.design/file-assets/01KWXKV4NTE9QGPKY075WQPCF7/01KXMST1MRYYVK93HE094S7DJF.png";
const GENIE_ONE_URL =
  "https://www.databricks.com/product/genie/one?itm_data=homepage-featuredproducts-tile2-genie&view=business-teams";

export function HeroIntro({ metrics }: HeroIntroProps) {
  const { tileSize } = metrics;
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
      aria-label="Intro"
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontSynthesis: "none",
        gap: tileSize * 0.46,
        marginLeft: metrics.left,
        marginTop: metrics.top,
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
          Satvik Shreesha
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
      <div
        style={{
          alignItems: "start",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: tileSize * 0.23,
          transform: `translateY(${metrics.bodyLineOffset}px)`,
        }}
      >
        <p style={{ ...textStyle, margin: 0 }}>
          Designing tooling to help humans get the most out of AI.
        </p>
        <div
          style={{
            alignItems: "center",
            boxSizing: "border-box",
            display: "flex",
            gap: tileSize * 0.17,
          }}
        >
          <span style={textStyle}>First Design Intern</span>
          <CodeTag
            href="https://www.databricks.com/"
            iconAspectRatio={15.07 / 16.22}
            iconSrc={DATABRICKS_MARK}
            label="databricks"
            lineHeight={lineHeight}
            textStyle={textStyle}
            tileSize={tileSize}
          />
          <span style={textStyle}>, designing </span>
          <a
            className="dashed-hover-link"
            href={GENIE_ONE_URL}
            rel="noreferrer"
            style={textStyle}
            target="_blank"
          >
            Genie One
          </a>
          <span style={textStyle}>.</span>
        </div>
        <div
          style={{
            alignItems: "center",
            boxSizing: "border-box",
            display: "flex",
            gap: tileSize * 0.17,
          }}
        >
          <span style={{ ...textStyle, flexShrink: 0, width: "max-content" }}>
            4th year Human-Centered Design &amp; Engineering
          </span>
          <CodeTag
            href="https://www.hcde.washington.edu/"
            iconAspectRatio={17 / 12}
            iconSrc={UOFWA_MARK}
            label="uofwa"
            lineHeight={lineHeight}
            textStyle={textStyle}
            tileSize={tileSize}
          />
          <span style={{ ...textStyle, flexShrink: 0, width: "max-content" }}>.</span>
        </div>
      </div>
    </section>
  );
}

function CodeTag({
  href,
  iconAspectRatio,
  iconSrc,
  label,
  lineHeight,
  textStyle,
  tileSize,
}: {
  href?: string;
  iconAspectRatio: number;
  iconSrc: string;
  label: string;
  lineHeight: number;
  textStyle: CSSProperties;
  tileSize: number;
}) {
  const iconTileSize = 22;
  const iconHeight = label === "uofwa" ? tileSize * 0.34 : tileSize * 0.46;
  const tagStyle = {
    alignItems: "center",
    backgroundColor: "var(--code-tag-surface, #2d2d2d)",
    boxSizing: "border-box",
    display: "inline-flex",
    flexShrink: 0,
    gap: tileSize * 0.2,
    height: lineHeight,
    justifyContent: "center",
    paddingInline: tileSize * 0.09,
    textDecoration: "none",
  } satisfies CSSProperties;

  const content = (
    <>
      <span
        aria-hidden="true"
        style={{
          alignItems: "center",
          backgroundColor: "var(--code-tag-icon-surface, #868686)",
          borderRadius: 3.75,
          boxSizing: "border-box",
          display: "flex",
          flexShrink: 0,
          height: iconTileSize,
          justifyContent: "center",
          width: iconTileSize,
        }}
      >
        <span
          style={{
            backgroundImage: `url(${iconSrc})`,
            backgroundPosition: "50%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            boxSizing: "border-box",
            flexShrink: 0,
            height: iconHeight,
            width: iconHeight * iconAspectRatio,
          }}
        />
      </span>
      <span
        style={{
          ...textStyle,
          color: "var(--hero-foreground)",
          flexShrink: 0,
          fontFamily: "var(--font-mono)",
          width: "max-content",
        }}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className="dashed-hover-link"
        href={href}
        rel="noreferrer"
        style={tagStyle}
        target="_blank"
      >
        {content}
      </a>
    );
  }

  return <span style={tagStyle}>{content}</span>;
}
