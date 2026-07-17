"use client";

import { useMemo } from "react";
import { getGridColumnCount } from "@/lib/constants";

type TileGridProps = {
  fadeEnabled: boolean;
  rows: number;
  navHeight: number;
  tileSize: number;
  viewportWidth: number;
};

const GRID_COLORS = {
  base: "#121212",
  off1: "#131111",
  off2: "#16161d",
};
const GRID_STROKE_COLOR = "#1c1c1c";
const GRID_SEED = 93_817;
const GRID_DENSITIES = {
  off1: 0.06,
  off2: 0.04,
};
const GRID_FADE_END_TILES = 37;

export function TileGrid({
  fadeEnabled,
  navHeight,
  rows,
  tileSize,
  viewportWidth,
}: TileGridProps) {
  const columns = getGridColumnCount(viewportWidth, tileSize);
  const width = columns * tileSize;
  const height = rows * tileSize;
  const scatteredTileBackground = useMemo(
    () => createScatteredTileBackground(columns, rows, tileSize),
    [columns, rows, tileSize],
  );
  const linePattern = [
    `linear-gradient(to right, ${GRID_STROKE_COLOR} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${GRID_STROKE_COLOR} 1px, transparent 1px)`,
  ].join(", ");

  return (
    <div
      className="absolute inset-x-0 top-0 z-0 overflow-hidden pointer-events-none"
      style={{
        backgroundColor: GRID_COLORS.base,
        height: navHeight + height,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute left-0 pointer-events-none"
        style={{
          backgroundColor: GRID_COLORS.base,
          backgroundImage: scatteredTileBackground,
          backgroundRepeat: "no-repeat",
          height,
          top: navHeight,
          width,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-0 pointer-events-none"
        style={{
          backgroundImage: linePattern,
          backgroundSize: `${tileSize}px ${tileSize}px`,
          borderBottom: `1px solid ${GRID_STROKE_COLOR}`,
          borderRight: `1px solid ${GRID_STROKE_COLOR}`,
          height,
          top: navHeight,
          width,
        }}
      />
      {fadeEnabled ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0"
          style={{
            background: `linear-gradient(to bottom, transparent 0px, ${GRID_COLORS.base} ${
              GRID_FADE_END_TILES * tileSize
            }px)`,
            height: Math.max(navHeight + height, GRID_FADE_END_TILES * tileSize),
          }}
        />
      ) : null}
    </div>
  );
}

function createScatteredTileBackground(columns: number, rows: number, tileSize: number) {
  const rects: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const value = hashCell(col, row, GRID_SEED);
      const fill =
        value < GRID_DENSITIES.off2
          ? GRID_COLORS.off2
          : value < GRID_DENSITIES.off2 + GRID_DENSITIES.off1
            ? GRID_COLORS.off1
            : null;

      if (!fill) {
        continue;
      }

      rects.push(
        `<rect x="${col * tileSize}" y="${row * tileSize}" width="${tileSize}" height="${tileSize}" fill="${fill}"/>`,
      );
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${
    columns * tileSize
  }" height="${rows * tileSize}" viewBox="0 0 ${columns * tileSize} ${
    rows * tileSize
  }">${rects.join("")}</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function hashCell(col: number, row: number, seed: number) {
  let hash = seed ^ (col * 374_761_393) ^ (row * 668_265_263);
  hash = (hash ^ (hash >>> 13)) * 1_274_126_177;
  hash = (hash ^ (hash >>> 16)) >>> 0;

  return hash / 4_294_967_295;
}
