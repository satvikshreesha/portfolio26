"use client";

import type { CSSProperties } from "react";

type StrokeLayerProps = {
  columns: number;
  rows: number;
  tileSize: number;
  strokeColor: string;
  gradientEnabled: boolean;
  gradientEndColor: string;
  gradientAngle: number;
};

export function StrokeLayer({
  columns,
  rows,
  tileSize,
  strokeColor,
  gradientEnabled,
  gradientEndColor,
  gradientAngle,
}: StrokeLayerProps) {
  const width = columns * tileSize;
  const height = rows * tileSize;
  const lineMask = [
    "linear-gradient(to right, #000 1px, transparent 1px)",
    "linear-gradient(to bottom, #000 1px, transparent 1px)",
  ].join(", ");
  const linePattern = [
    `linear-gradient(to right, ${strokeColor} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${strokeColor} 1px, transparent 1px)`,
  ].join(", ");
  const backgroundSize = `${tileSize}px ${tileSize}px`;

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 pointer-events-none"
        style={
          {
            width,
            height,
            backgroundImage: linePattern,
            backgroundSize,
            borderBottom: `1px solid ${strokeColor}`,
            borderRight: `1px solid ${strokeColor}`,
          } satisfies CSSProperties
        }
      />
      {gradientEnabled ? (
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 pointer-events-none"
          style={
            {
              width,
              height,
              backgroundImage: `linear-gradient(${gradientAngle}deg, ${strokeColor}, ${gradientEndColor})`,
              maskImage: lineMask,
              WebkitMaskImage: lineMask,
              maskSize: backgroundSize,
              WebkitMaskSize: backgroundSize,
              borderBottom: `1px solid ${gradientEndColor}`,
              borderRight: `1px solid ${gradientEndColor}`,
            } satisfies CSSProperties
          }
        />
      ) : null}
    </>
  );
}
