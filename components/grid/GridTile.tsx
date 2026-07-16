"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { GridCell, TileVariant } from "@/lib/tileGrid";

type TileColors = Record<TileVariant, string>;

type GridTileProps = {
  cell: GridCell;
  colors: TileColors;
  interactive: boolean;
};

export function GridTile({ cell, colors, interactive }: GridTileProps) {
  const shouldReduceMotion = useReducedMotion();
  const isOffTile = cell.variant !== "base";
  const animationDelay = ((cell.col * 17 + cell.row * 29) % 180) / 1000;

  return (
    <motion.div
      data-cell-id={cell.id}
      data-col={cell.col}
      data-row={cell.row}
      data-variant={cell.variant}
      data-accepts-drop={cell.acceptsDrop}
      className="relative min-h-0 min-w-0 overflow-hidden"
      initial={
        isOffTile && !shouldReduceMotion ? { opacity: 0, scale: 0.96 } : false
      }
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.18,
        delay: animationDelay,
        ease: "easeOut",
      }}
      style={
        {
          backgroundColor: colors[cell.variant],
          pointerEvents: interactive && cell.acceptsDrop ? "auto" : "none",
        } satisfies CSSProperties
      }
    >
      {cell.content.type === "image" ? (
        <Image
          src={cell.content.src}
          alt={cell.content.alt ?? ""}
          fill
          unoptimized
          sizes="10vw"
          className="object-cover"
          draggable={false}
        />
      ) : null}
    </motion.div>
  );
}
