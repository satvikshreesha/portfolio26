import type { AboutPhotoSeed } from "@/data/aboutPhotos";

export type GridRect = {
  cellI: number;
  cellJ: number;
  spanW: number;
  spanH: number;
};

export type AboutPhotoItem = AboutPhotoSeed & GridRect;

export type AboutGridSize = {
  cols: number;
  rows: number;
};

type PlacementRegion = GridRect;

const MAX_ATTEMPTS = 80;
const MAX_PHOTO_SPAN = 5;
const REGION_RANDOM_SAMPLES = 72;
const GLOBAL_RANDOM_SAMPLES = 120;

export function getAboutCellKey(cellI: number, cellJ: number) {
  return `${cellI},${cellJ}`;
}

export function rectsOverlap(a: GridRect, b: GridRect) {
  return (
    a.cellI < b.cellI + b.spanW &&
    a.cellI + a.spanW > b.cellI &&
    a.cellJ < b.cellJ + b.spanH &&
    a.cellJ + a.spanH > b.cellJ
  );
}

export function canPlaceAboutBlock({
  blockedRects,
  grid,
  occupied,
  rect,
}: {
  blockedRects: GridRect[];
  grid: AboutGridSize;
  occupied: Set<string>;
  rect: GridRect;
}) {
  if (
    rect.cellI < 0 ||
    rect.cellJ < 0 ||
    rect.cellI + rect.spanW > grid.cols ||
    rect.cellJ + rect.spanH > grid.rows
  ) {
    return false;
  }

  if (blockedRects.some((blockedRect) => rectsOverlap(rect, blockedRect))) {
    return false;
  }

  for (let cellJ = rect.cellJ - 1; cellJ <= rect.cellJ + rect.spanH; cellJ += 1) {
    for (let cellI = rect.cellI - 1; cellI <= rect.cellI + rect.spanW; cellI += 1) {
      if (occupied.has(getAboutCellKey(cellI, cellJ))) {
        return false;
      }
    }
  }

  return true;
}

export function occupyAboutBlock(occupied: Set<string>, rect: GridRect) {
  for (let cellJ = rect.cellJ; cellJ < rect.cellJ + rect.spanH; cellJ += 1) {
    for (let cellI = rect.cellI; cellI < rect.cellI + rect.spanW; cellI += 1) {
      occupied.add(getAboutCellKey(cellI, cellJ));
    }
  }
}

export function createInitialAboutLayout({
  blockedRects,
  grid,
  photos,
}: {
  blockedRects: GridRect[];
  grid: AboutGridSize;
  photos: AboutPhotoSeed[];
}) {
  return computeRandomAboutLayoutWithSizesOrFallback({
    blockedRects,
    grid,
    items: photos.map((photo) => ({
      ...photo,
      cellI: 0,
      cellJ: 0,
      ...clampPhotoSize({ spanH: photo.baseSpanH, spanW: photo.baseSpanW }),
    })),
  });
}

export function computeRandomAboutLayoutWithSizesOrFallback({
  blockedRects,
  grid,
  items,
}: {
  blockedRects: GridRect[];
  grid: AboutGridSize;
  items: AboutPhotoItem[];
}) {
  const resized = computeRandomAboutLayout({
    blockedRects,
    grid,
    items,
    randomizeSizes: true,
  });

  if (resized) {
    return resized;
  }

  return computeRandomAboutLayout({
    blockedRects,
    grid,
    items,
    randomizeSizes: false,
  });
}

function computeRandomAboutLayout({
  blockedRects,
  grid,
  items,
  randomizeSizes,
}: {
  blockedRects: GridRect[];
  grid: AboutGridSize;
  items: AboutPhotoItem[];
  randomizeSizes: boolean;
}) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const placed = packItemsByRegion({
      attempt,
      blockedRects,
      grid,
      items: shuffle(
        [...items].sort((a, b) => b.baseSpanW * b.baseSpanH - a.baseSpanW * a.baseSpanH),
      ),
      randomizeSizes,
    });

    if (placed) {
      return placed;
    }
  }

  return null;
}

function packItemsByRegion({
  attempt,
  blockedRects,
  grid,
  items,
  randomizeSizes,
}: {
  attempt: number;
  blockedRects: GridRect[];
  grid: AboutGridSize;
  items: AboutPhotoItem[];
  randomizeSizes: boolean;
}) {
  const occupied = new Set<string>();
  const placedRects: GridRect[] = [];
  const result = new Map<string, AboutPhotoItem>();
  const regions = rotateItems(shuffle(getPlacementRegions(grid, blockedRects)), attempt);

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const rect = pickRectForItem({
      blockedRects,
      grid,
      item,
      occupied,
      placedRects,
      preferredRegions: rotateItems(regions, index),
      randomizeSizes,
    });

    if (!rect) {
      return null;
    }

    occupyAboutBlock(occupied, rect);
    placedRects.push(rect);
    result.set(item.id, { ...item, ...rect });
  }

  return items
    .map((item) => result.get(item.id))
    .filter((item): item is AboutPhotoItem => Boolean(item));
}

function pickRectForItem({
  blockedRects,
  grid,
  item,
  occupied,
  placedRects,
  preferredRegions,
  randomizeSizes,
}: {
  blockedRects: GridRect[];
  grid: AboutGridSize;
  item: AboutPhotoItem;
  occupied: Set<string>;
  placedRects: GridRect[];
  preferredRegions: PlacementRegion[];
  randomizeSizes: boolean;
}) {
  for (const size of getSizeOptions(item, randomizeSizes)) {
    for (const region of preferredRegions) {
      const rect = pickBestCandidate({
        blockedRects,
        candidates: [
          ...sampleAnchorsInRegion(region, size, REGION_RANDOM_SAMPLES),
          ...enumerateAnchorsInRegion(region, size),
        ],
        grid,
        occupied,
        placedRects,
      });

      if (rect) {
        return rect;
      }
    }

    const globalRegion = { cellI: 0, cellJ: 0, spanW: grid.cols, spanH: grid.rows };
    const globalRect = pickBestCandidate({
      blockedRects,
      candidates: [
        ...sampleAnchorsInRegion(globalRegion, size, GLOBAL_RANDOM_SAMPLES),
        ...enumerateAnchorsInRegion(globalRegion, size),
      ],
      grid,
      occupied,
      placedRects,
    });

    if (globalRect) {
      return globalRect;
    }
  }

  return null;
}

function getPlacementRegions(grid: AboutGridSize, blockedRects: GridRect[]): PlacementRegion[] {
  const bounds = getBoundingRect(blockedRects);
  const leftEnd = bounds.cellI;
  const rightStart = bounds.cellI + bounds.spanW;
  const topEnd = bounds.cellJ;
  const bottomStart = bounds.cellJ + bounds.spanH;
  const centerStartI = Math.max(0, bounds.cellI - 3);
  const centerEndI = Math.min(grid.cols, bounds.cellI + bounds.spanW + 3);
  const centerStartJ = Math.max(0, bounds.cellJ - 3);
  const centerEndJ = Math.min(grid.rows, bounds.cellJ + bounds.spanH + 3);
  const regions = [
    rectFromEdges(centerStartI, 0, centerEndI, topEnd),
    rectFromEdges(centerStartI, bottomStart, centerEndI, grid.rows),
    rectFromEdges(0, centerStartJ, leftEnd, centerEndJ),
    rectFromEdges(rightStart, centerStartJ, grid.cols, centerEndJ),
    rectFromEdges(0, 0, leftEnd, topEnd),
    rectFromEdges(rightStart, 0, grid.cols, topEnd),
    rectFromEdges(0, bottomStart, leftEnd, grid.rows),
    rectFromEdges(rightStart, bottomStart, grid.cols, grid.rows),
  ];

  return regions.filter((region) => region.spanW > 0 && region.spanH > 0);
}

function pickBestCandidate({
  blockedRects,
  candidates,
  grid,
  occupied,
  placedRects,
}: {
  blockedRects: GridRect[];
  candidates: GridRect[];
  grid: AboutGridSize;
  occupied: Set<string>;
  placedRects: GridRect[];
}) {
  return candidates
    .filter((rect) => canPlaceAboutBlock({ blockedRects, grid, occupied, rect }))
    .map((rect) => ({ rect, score: scoreCandidate({ grid, placedRects, rect }) }))
    .sort((a, b) => b.score - a.score)[0]?.rect;
}

function scoreCandidate({
  grid,
  placedRects,
  rect,
}: {
  grid: AboutGridSize;
  placedRects: GridRect[];
  rect: GridRect;
}) {
  return (
    getDistanceFromPlaced(placedRects, rect, grid) * 1.25 -
    countRectsInQuadrant(placedRects, grid, rect) * 10 -
    getEdgePenalty(grid, rect) +
    Math.random() * 12
  );
}

function sampleAnchorsInRegion(
  region: PlacementRegion,
  size: Pick<GridRect, "spanH" | "spanW">,
  count: number,
) {
  const maxI = region.cellI + region.spanW - size.spanW;
  const maxJ = region.cellJ + region.spanH - size.spanH;

  if (maxI < region.cellI || maxJ < region.cellJ) {
    return [];
  }

  return Array.from({ length: count }, () => ({
    cellI: randomInt(region.cellI, maxI),
    cellJ: randomInt(region.cellJ, maxJ),
    spanH: size.spanH,
    spanW: size.spanW,
  }));
}

function enumerateAnchorsInRegion(
  region: PlacementRegion,
  size: Pick<GridRect, "spanH" | "spanW">,
) {
  const rects: GridRect[] = [];
  const maxI = region.cellI + region.spanW - size.spanW;
  const maxJ = region.cellJ + region.spanH - size.spanH;

  for (let cellJ = region.cellJ; cellJ <= maxJ; cellJ += 1) {
    for (let cellI = region.cellI; cellI <= maxI; cellI += 1) {
      rects.push({ cellI, cellJ, spanH: size.spanH, spanW: size.spanW });
    }
  }

  return shuffle(rects).slice(0, 180);
}

function getSizeOptions(
  item: Pick<AboutPhotoItem, "baseSpanH" | "baseSpanW">,
  randomizeSizes: boolean,
) {
  const base = clampPhotoSize({ spanH: item.baseSpanH, spanW: item.baseSpanW });

  if (!randomizeSizes) {
    return [base];
  }

  return shuffle(
    uniqueSizes([
      base,
      { spanW: 5, spanH: 5 },
      { spanW: 5, spanH: 4 },
      { spanW: 4, spanH: 5 },
      { spanW: 4, spanH: 4 },
      { spanW: 3, spanH: 4 },
      { spanW: 4, spanH: 3 },
      { spanW: 3, spanH: 3 },
    ]),
  );
}

function clampPhotoSize(size: Pick<GridRect, "spanH" | "spanW">) {
  return {
    spanH: Math.max(1, Math.min(MAX_PHOTO_SPAN, size.spanH)),
    spanW: Math.max(1, Math.min(MAX_PHOTO_SPAN, size.spanW)),
  };
}

function uniqueSizes(sizes: Array<Pick<GridRect, "spanH" | "spanW">>) {
  const seen = new Set<string>();

  return sizes
    .map(clampPhotoSize)
    .filter((size) => {
      const key = `${size.spanW}:${size.spanH}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });
}

function getDistanceFromPlaced(
  placedRects: GridRect[],
  rect: GridRect,
  grid: AboutGridSize,
) {
  if (placedRects.length === 0) {
    return Math.min(grid.cols, grid.rows) * 0.5;
  }

  const center = getRectCenter(rect);

  return Math.min(
    ...placedRects.map((placedRect) => {
      const placedCenter = getRectCenter(placedRect);

      return Math.hypot(center.i - placedCenter.i, center.j - placedCenter.j);
    }),
  );
}

function countRectsInQuadrant(placedRects: GridRect[], grid: AboutGridSize, rect: GridRect) {
  const quadrant = getQuadrant(grid, rect);

  return placedRects.filter((placedRect) => getQuadrant(grid, placedRect) === quadrant).length;
}

function getEdgePenalty(grid: AboutGridSize, rect: GridRect) {
  const distanceToEdge = Math.min(
    rect.cellI,
    rect.cellJ,
    grid.cols - (rect.cellI + rect.spanW),
    grid.rows - (rect.cellJ + rect.spanH),
  );

  return distanceToEdge <= 0 ? 10 : distanceToEdge === 1 ? 4 : 0;
}

function getQuadrant(grid: AboutGridSize, rect: GridRect) {
  const center = getRectCenter(rect);
  const horizontal = center.i < grid.cols / 2 ? "left" : "right";
  const vertical = center.j < grid.rows / 2 ? "top" : "bottom";

  return `${vertical}-${horizontal}`;
}

function getRectCenter(rect: GridRect) {
  return {
    i: rect.cellI + rect.spanW / 2,
    j: rect.cellJ + rect.spanH / 2,
  };
}

function getBoundingRect(rects: GridRect[]) {
  const minI = Math.min(...rects.map((rect) => rect.cellI));
  const minJ = Math.min(...rects.map((rect) => rect.cellJ));
  const maxI = Math.max(...rects.map((rect) => rect.cellI + rect.spanW));
  const maxJ = Math.max(...rects.map((rect) => rect.cellJ + rect.spanH));

  return rectFromEdges(minI, minJ, maxI, maxJ);
}

function rectFromEdges(minI: number, minJ: number, maxI: number, maxJ: number) {
  return {
    cellI: minI,
    cellJ: minJ,
    spanH: Math.max(0, maxJ - minJ),
    spanW: Math.max(0, maxI - minI),
  };
}

function shuffle<T>(items: T[]) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function rotateItems<T>(items: T[], offset: number) {
  if (items.length === 0) {
    return items;
  }

  const normalizedOffset = offset % items.length;

  return [...items.slice(normalizedOffset), ...items.slice(0, normalizedOffset)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
