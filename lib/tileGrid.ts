export type TileVariant = "base" | "off1" | "off2";

export type TileContent =
  | { type: "empty" }
  | { type: "image"; src: string; alt?: string };

export type GridCell = {
  id: string;
  col: number;
  row: number;
  variant: TileVariant;
  content: TileContent;
  acceptsDrop: boolean;
};

export type GridLayout = {
  columns: number;
  rows: number;
  seed: number;
  cells: GridCell[];
};

export type GridDensities = {
  off1: number;
  off2: number;
};

export type GridGenerationOptions = {
  columns: number;
  rows: number;
  seed: number;
  densities: GridDensities;
  previousLayout?: GridLayout;
};

export type SnapPoint = {
  col: number;
  row: number;
  cellId: string;
};

const EMPTY_CONTENT: TileContent = { type: "empty" };

export function getCellId(col: number, row: number) {
  return `${col}:${row}`;
}

export function clampGridValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function createSeed() {
  return Math.floor(Math.random() * 2_147_483_647);
}

export function generateGrid({
  columns,
  rows,
  seed,
  densities,
  previousLayout,
}: GridGenerationOptions): GridLayout {
  const safeColumns = clampGridValue(columns, 1, 120);
  const safeRows = clampGridValue(rows, 1, 120);
  const previousContent = new Map(
    previousLayout?.cells
      .filter((cell) => cell.content.type !== "empty")
      .map((cell) => [cell.id, cell.content]) ?? [],
  );

  const cells: GridCell[] = [];

  for (let row = 0; row < safeRows; row += 1) {
    for (let col = 0; col < safeColumns; col += 1) {
      const id = getCellId(col, row);

      cells.push({
        id,
        col,
        row,
        variant: getVariantForCell(col, row, seed, densities),
        content: previousContent.get(id) ?? EMPTY_CONTENT,
        acceptsDrop: true,
      });
    }
  }

  return {
    columns: safeColumns,
    rows: safeRows,
    seed,
    cells,
  };
}

export function getCellAt(layout: GridLayout, col: number, row: number) {
  if (col < 0 || row < 0 || col >= layout.columns || row >= layout.rows) {
    return undefined;
  }

  return layout.cells[row * layout.columns + col];
}

export function snapToCell(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">,
  columns: number,
  rows: number,
): SnapPoint {
  const cellWidth = rect.width / columns;
  const cellHeight = rect.height / rows;
  const col = clampGridValue(Math.floor((clientX - rect.left) / cellWidth), 0, columns - 1);
  const row = clampGridValue(Math.floor((clientY - rect.top) / cellHeight), 0, rows - 1);

  return {
    col,
    row,
    cellId: getCellId(col, row),
  };
}

export function getCellSize(
  rect: Pick<DOMRectReadOnly, "width" | "height">,
  columns: number,
  rows: number,
) {
  return {
    width: rect.width / columns,
    height: rect.height / rows,
  };
}

function getVariantForCell(
  col: number,
  row: number,
  seed: number,
  densities: GridDensities,
): TileVariant {
  const value = hashCell(col, row, seed);

  if (value < densities.off2) {
    return "off2";
  }

  if (value < densities.off2 + densities.off1) {
    return "off1";
  }

  return "base";
}

function hashCell(col: number, row: number, seed: number) {
  let hash = seed ^ (col * 374_761_393) ^ (row * 668_265_263);
  hash = (hash ^ (hash >>> 13)) * 1_274_126_177;
  hash = (hash ^ (hash >>> 16)) >>> 0;

  return hash / 4_294_967_295;
}
