"use client";

import { useMemo } from "react";
import { GridTile } from "@/components/grid/GridTile";
import { StrokeLayer } from "@/components/grid/StrokeLayer";
import { useGridState } from "@/hooks/useGridState";
import { getGridColumnCount } from "@/lib/constants";
import { generateGrid } from "@/lib/tileGrid";

type TileGridProps = {
  fadeEnabled: boolean;
  rows: number;
  navHeight: number;
  tileSize: number;
  viewportWidth: number;
};

const GRID_SEED = 93_817;
const GRID_COLORS = {
  base: "#121212",
  off1: "#131111",
  off2: "#16161d",
};
const GRID_STROKE_COLOR = "#1c1c1c";
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

  const initialLayout = useMemo(
    () =>
      generateGrid({
        columns,
        rows,
        seed: GRID_SEED,
        densities: GRID_DENSITIES,
      }),
    [columns, rows],
  );

  const { layout } = useGridState({
    id: "landing-grid",
    persist: false,
    initialLayout,
  });

  return (
    <div
      className="absolute inset-x-0 top-0 z-0 overflow-hidden pointer-events-none"
      style={{
        backgroundColor: GRID_COLORS.base,
        height: navHeight + layout.rows * tileSize,
      }}
    >
      <div className="absolute left-0" style={{ top: navHeight }}>
        <div
          className="grid"
          style={{
            width: layout.columns * tileSize,
            height: layout.rows * tileSize,
            gridTemplateColumns: `repeat(${layout.columns}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${layout.rows}, ${tileSize}px)`,
          }}
        >
          {layout.cells.map((cell) => (
            <GridTile
              key={cell.id}
              cell={cell}
              colors={GRID_COLORS}
              interactive={false}
            />
          ))}
        </div>
        <StrokeLayer
          columns={layout.columns}
          rows={layout.rows}
          tileSize={tileSize}
          strokeColor={GRID_STROKE_COLOR}
          gradientEnabled={false}
          gradientEndColor="#2a2a2a"
          gradientAngle={135}
        />
      </div>
      {fadeEnabled ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0"
          style={{
            background: `linear-gradient(to bottom, transparent 0px, ${GRID_COLORS.base} ${
              GRID_FADE_END_TILES * tileSize
            }px)`,
            height: Math.max(
              navHeight + layout.rows * tileSize,
              GRID_FADE_END_TILES * tileSize,
            ),
          }}
        />
      ) : null}
    </div>
  );
}
