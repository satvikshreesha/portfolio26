export const TILE_SIZE = 35;
export const NAV_HEIGHT = 43;

/** Minimum grid columns regardless of viewport width. */
export const GRID_MIN_COLUMNS = 80;
export const GRID_MIN_ROWS = 60;

/** Extra columns beyond the viewport edge so the grid never stops short. */
export const GRID_OVERFLOW_COLUMNS = 4;

export function getGridColumnCount(viewportWidth: number, tileSize: number) {
  const viewportColumns = Math.ceil(Math.max(viewportWidth, 0) / tileSize);

  return Math.max(GRID_MIN_COLUMNS, viewportColumns + GRID_OVERFLOW_COLUMNS);
}
