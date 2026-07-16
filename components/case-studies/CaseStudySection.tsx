import Image from "next/image";
import type { CSSProperties } from "react";
import {
  getCaseStudyCoverSrc,
  type CaseStudy,
  type CaseStudyProject,
} from "@/data/caseStudies";

export type CaseStudiesMetrics = {
  tileSize: number;
  left: number;
  top: number;
  cardWidth: number;
  imageHeight: number;
  rowGap: number;
};

type CaseStudySectionProps = {
  caseStudy: CaseStudy;
  metrics: CaseStudiesMetrics;
};

export function CaseStudySection({ caseStudy, metrics }: CaseStudySectionProps) {
  const { tileSize } = metrics;
  const eyebrowStyle = getMonoTextStyle(tileSize);
  const bodyStyle = getBodyTextStyle(tileSize);

  return (
    <section
      aria-label={`${caseStudy.company} case studies`}
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        fontSynthesis: "none",
        gap: tileSize * 0.37,
        minWidth: 0,
        MozOsxFontSmoothing: "grayscale",
        overflow: "hidden",
        WebkitFontSmoothing: "antialiased",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          boxSizing: "border-box",
          display: "flex",
          gap: tileSize * 0.43,
        }}
      >
        <Image
          alt=""
          aria-hidden="true"
          height={57}
          src={caseStudy.logoSrc}
          style={{
            borderRadius: tileSize * 0.11,
            boxSizing: "border-box",
            display: "block",
            flexShrink: 0,
            height: tileSize * 0.54,
            objectFit: "cover",
            width: tileSize * 0.54,
          }}
          width={57}
        />
        <a
          className="dashed-hover-link"
          href={caseStudy.companyUrl}
          rel="noreferrer"
          style={eyebrowStyle}
          target="_blank"
        >
          {caseStudy.company}
        </a>
        <div style={{ ...eyebrowStyle, color: "var(--text-nav)" }}>| {caseStudy.year}</div>
      </div>
      <div style={bodyStyle}>{caseStudy.description}</div>
      <div
        className="scrollbar-hidden"
        style={{
          alignItems: "start",
          boxSizing: "border-box",
          display: "flex",
          gap: metrics.rowGap,
          overflowX: "auto",
          overflowY: "hidden",
          overscrollBehaviorX: "contain",
          paddingRight: metrics.left,
          scrollbarColor: "transparent transparent",
          width: "100%",
        }}
      >
        {caseStudy.projects.map((project) => (
          <CaseStudyCard
            key={project.title}
            caseStudy={caseStudy}
            imageHeight={metrics.imageHeight}
            project={project}
            tileSize={tileSize}
            width={metrics.cardWidth}
          />
        ))}
      </div>
    </section>
  );
}

export function CaseStudiesStack({
  caseStudies,
  metrics,
}: {
  caseStudies: CaseStudy[];
  metrics: CaseStudiesMetrics;
}) {
  return (
    <div
      id="case-studies"
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: metrics.tileSize * 1.03,
        marginLeft: metrics.left,
        marginTop: metrics.top,
        maxWidth: `calc(100vw - ${metrics.left}px)`,
        minWidth: 0,
        overflow: "hidden",
        pointerEvents: "auto",
        position: "relative",
        width: `calc(100vw - ${metrics.left}px)`,
        zIndex: 10,
      }}
    >
      {caseStudies.map((caseStudy) => (
        <CaseStudySection
          key={`${caseStudy.company}-${caseStudy.year}`}
          caseStudy={caseStudy}
          metrics={metrics}
        />
      ))}
    </div>
  );
}

function CaseStudyCard({
  caseStudy,
  project,
  imageHeight,
  tileSize,
  width,
}: {
  caseStudy: CaseStudy;
  imageHeight: number;
  project: CaseStudyProject;
  tileSize: number;
  width: number;
}) {
  const coverSrc = getCaseStudyCoverSrc(caseStudy, project);

  return (
    <article
      style={{
        alignItems: "start",
        boxSizing: "border-box",
        display: "flex",
        flex: "0 0 auto",
        flexDirection: "column",
        gap: tileSize * 0.34,
        width,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--background)",
          border: "1px solid var(--hairline)",
          boxSizing: "border-box",
          height: imageHeight,
          overflow: "hidden",
          position: "relative",
          width,
        }}
      >
        <div
          style={{
            inset: -1,
            position: "absolute",
          }}
        >
          <Image
            alt={`${project.title} cover`}
            draggable={false}
            fill
            loading="lazy"
            quality={90}
            sizes={`${Math.round(width)}px`}
            src={coverSrc}
            style={{
              objectFit: "cover",
              objectPosition: "center",
              transform: "scale(1.01)",
              transformOrigin: "center",
            }}
          />
        </div>
      </div>
      <h3
        style={{
          ...getBodyTextStyle(tileSize),
          margin: 0,
        }}
      >
        {project.title}
      </h3>
    </article>
  );
}

function getMonoTextStyle(tileSize: number) {
  return {
    boxSizing: "border-box",
    color: "var(--databricks-text, #efddda)",
    flexShrink: 0,
    fontFamily: "var(--font-mono)",
    fontSize: tileSize * 0.51,
    fontWeight: 500,
    lineHeight: `${tileSize * 0.63}px`,
    width: "max-content",
  } satisfies CSSProperties;
}

function getBodyTextStyle(tileSize: number) {
  return {
    boxSizing: "border-box",
    color: "var(--databricks-text, #efddda)",
    fontFamily: "var(--font-sans)",
    fontSize: tileSize * 0.4,
    fontWeight: 500,
    lineHeight: `${tileSize * 0.51}px`,
    width: "max-content",
  } satisfies CSSProperties;
}
