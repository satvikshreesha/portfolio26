import type { CSSProperties } from "react";
import { ABOUT_PHOTOS } from "@/data/aboutPhotos";
import { ABOUT_COPY_LINES } from "@/components/about/aboutCopy";
import { PhotoSurface } from "@/components/about/PhotoSurface";

export function MobileAbout({
  fontSize,
  lineHeight,
  navHeight,
  textStyle,
  tileSize,
}: {
  fontSize: number;
  lineHeight: number;
  navHeight: number;
  textStyle: CSSProperties;
  tileSize: number;
}) {
  return (
    <section
      aria-label="About Satvik"
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: tileSize,
        minHeight: "100vh",
        padding: `${navHeight + tileSize * 2}px ${tileSize * 0.75}px ${tileSize * 2}px`,
      }}
    >
      <p style={{ ...textStyle, fontSize, lineHeight: `${lineHeight}px`, maxWidth: 520 }}>
        {ABOUT_COPY_LINES.map((line) => (
          <span key={line} style={{ display: "block" }}>
            {line}
          </span>
        ))}
      </p>
      <div
        aria-hidden="true"
        style={{
          display: "grid",
          gap: tileSize * 0.5,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          maxWidth: 430,
          width: "100%",
        }}
      >
        {ABOUT_PHOTOS.slice(0, 4).map((photo) => (
          <div key={photo.id} style={{ aspectRatio: "1 / 1" }}>
            <PhotoSurface alt={photo.alt} src={photo.src} />
          </div>
        ))}
      </div>
    </section>
  );
}
