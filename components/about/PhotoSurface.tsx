import Image from "next/image";
import type { CSSProperties } from "react";

export function PhotoSurface({ alt, src }: { alt: string; src?: string }) {
  const baseStyle = {
    background: src ? "transparent" : "var(--foreground)",
    borderRadius: 0,
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  } satisfies CSSProperties;

  if (!src) {
    return <div aria-label={alt} role="img" style={baseStyle} />;
  }

  return (
    <div style={baseStyle}>
      <Image
        alt={alt}
        fill
        src={src}
        sizes="(min-width: 760px) 25vw, 50vw"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
