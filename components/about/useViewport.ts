"use client";

import { useEffect, useState } from "react";

export type Viewport = {
  height: number;
  width: number;
};

export const DEFAULT_ABOUT_VIEWPORT: Viewport = {
  height: 900,
  width: 1440,
};

export function useViewport(defaultViewport = DEFAULT_ABOUT_VIEWPORT) {
  const [viewport, setViewport] = useState<Viewport>(defaultViewport);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ height: window.innerHeight, width: window.innerWidth });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  return viewport;
}
