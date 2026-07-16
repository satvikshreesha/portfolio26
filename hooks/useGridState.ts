"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GridCell, GridLayout, TileContent } from "@/lib/tileGrid";

type UseGridStateOptions = {
  id: string;
  persist?: boolean;
  initialLayout: GridLayout;
};

type PersistedLayout = Pick<GridLayout, "columns" | "rows" | "seed" | "cells">;
type ContentByCellId = Record<string, TileContent>;

export function useGridState({
  id,
  persist = false,
  initialLayout,
}: UseGridStateOptions) {
  const storageKey = `satvik:grid:${id}`;
  const [contentByCellId, setContentByCellId] = useState<ContentByCellId>(() =>
    persist ? readPersistedContent(storageKey) : {},
  );
  const layout = useMemo(
    () => mergeContentIntoLayout(initialLayout, contentByCellId),
    [contentByCellId, initialLayout],
  );

  useEffect(() => {
    if (!persist) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(layout));
  }, [layout, persist, storageKey]);

  const updateCellContent = useCallback((cellId: string, content: TileContent) => {
    setContentByCellId((current) => ({
      ...current,
      [cellId]: content,
    }));
  }, []);

  const replaceLayout = useCallback((nextLayout: GridLayout) => {
    setContentByCellId(getContentByCellId(nextLayout));
  }, []);

  const exportLayout = useCallback(() => {
    return JSON.stringify(layout, null, 2);
  }, [layout]);

  const importLayout = useCallback((serializedLayout: string) => {
    const parsed = JSON.parse(serializedLayout) as GridLayout;
    setContentByCellId(getContentByCellId(parsed));
  }, []);

  return {
    layout,
    setLayout: replaceLayout,
    updateCellContent,
    replaceLayout,
    exportLayout,
    importLayout,
  };
}

function normalizeCell(cell: GridCell): GridCell {
  return {
    ...cell,
    acceptsDrop: cell.acceptsDrop ?? true,
    content: cell.content ?? { type: "empty" },
  };
}

function mergeContentIntoLayout(
  baseLayout: GridLayout,
  contentByCellId: ContentByCellId,
) {
  return {
    ...baseLayout,
    cells: baseLayout.cells.map((cell) => ({
      ...cell,
      content: contentByCellId[cell.id] ?? cell.content,
    })),
  };
}

function readPersistedContent(storageKey: string): ContentByCellId {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const saved = window.localStorage.getItem(storageKey);

    if (!saved) {
      return {};
    }

    const parsed = JSON.parse(saved) as PersistedLayout;
    return getContentByCellId({
      ...parsed,
      cells: parsed.cells.map(normalizeCell),
    });
  } catch {
    window.localStorage.removeItem(storageKey);
    return {};
  }
}

function getContentByCellId(layout: PersistedLayout): ContentByCellId {
  return Object.fromEntries(
    layout.cells
      .filter((cell) => cell.content.type !== "empty")
      .map((cell) => [cell.id, cell.content]),
  );
}
