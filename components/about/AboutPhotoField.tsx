"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ABOUT_PHOTOS } from "@/data/aboutPhotos";
import { PhotoSurface } from "@/components/about/PhotoSurface";
import {
  type AboutGridSize,
  type AboutPhotoItem,
  type GridRect,
  computeRandomAboutLayoutWithSizesOrFallback,
  createInitialAboutLayout,
} from "@/lib/aboutPhotoGrid";

const SHUFFLE_TRAVEL_MS = 900;
const SHUFFLE_BLEND_MS = 180;
const FLYOUT_SCALE = 1.055;
const DIM_OPACITY = 0.08;

type MeasuredRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type ShuffleFlight = {
  alt: string;
  id: string;
  rect: MeasuredRect;
  src: string | undefined;
  to: MeasuredRect;
};

export function AboutPhotoField({
  blockedRects,
  grid,
  introOrigin,
  navHeight,
  onShuffleChange,
  tileSize,
}: {
  blockedRects: GridRect[];
  grid: AboutGridSize;
  introOrigin: { x: number; y: number };
  navHeight: number;
  onShuffleChange: (isShuffling: boolean) => void;
  tileSize: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const hasPlayedIntroRef = useRef(false);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());
  const animationFrameRef = useRef<number | null>(null);
  const [items, setItems] = useState<AboutPhotoItem[]>(
    () =>
      createInitialAboutLayout({
        blockedRects,
        grid,
        photos: ABOUT_PHOTOS,
      }) ?? [],
  );
  const [flights, setFlights] = useState<ShuffleFlight[]>([]);
  const [shuffleBlend, setShuffleBlend] = useState(0);
  const [introBlend, setIntroBlend] = useState(prefersReducedMotion ? 0 : 1);
  const [imagesReady, setImagesReady] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sources = items.map((item) => item.src).filter((src): src is string => Boolean(src));

    if (sources.length === 0) {
      queueMicrotask(() => {
        if (!cancelled) {
          setImagesReady(true);
        }
      });
      return;
    }

    Promise.all(
      sources.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new window.Image();

            image.onload = () => {
              if ("decode" in image) {
                image.decode().then(resolve).catch(resolve);
                return;
              }

              resolve();
            };
            image.onerror = () => resolve();
            image.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) {
        setImagesReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [items]);

  useEffect(() => {
    if (hasPlayedIntroRef.current || prefersReducedMotion || items.length === 0) {
      setIntroBlend(0);
      return;
    }

    if (!imagesReady) {
      return;
    }

    hasPlayedIntroRef.current = true;

    animationFrameRef.current = window.requestAnimationFrame((startedAt) => {
      setIsShuffling(true);
      onShuffleChange(true);
      setIntroBlend(1);

      const step = (now: number) => {
        const elapsed = Math.min(now - startedAt, SHUFFLE_TRAVEL_MS);
        const progress = easeInOut(elapsed / SHUFFLE_TRAVEL_MS);

        setIntroBlend(1 - progress);

        if (elapsed < SHUFFLE_TRAVEL_MS) {
          animationFrameRef.current = window.requestAnimationFrame(step);
          return;
        }

        setIntroBlend(0);
        setIsShuffling(false);
        onShuffleChange(false);
        animationFrameRef.current = null;
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    });
  }, [imagesReady, items.length, onShuffleChange, prefersReducedMotion]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  const randomize = useCallback(() => {
    if (items.length === 0 || isShuffling) {
      return;
    }

    const layout = computeRandomAboutLayoutWithSizesOrFallback({
      blockedRects,
      grid,
      items,
    });

    if (!layout) {
      return;
    }

    if (prefersReducedMotion) {
      setItems(layout);
      return;
    }

    const nextById = new Map(layout.map((item) => [item.id, item]));
    const measuredFlights = items
      .map((item) => {
        const element = itemRefs.current.get(item.id);
        const target = nextById.get(item.id);

        if (!element || !target) {
          return null;
        }

        const from = element.getBoundingClientRect();
        const to = gridBlockToClientRect(target, navHeight, tileSize);

        return {
          alt: item.alt,
          id: item.id,
          rect: {
            height: from.height,
            left: from.left,
            top: from.top,
            width: from.width,
          },
          src: item.src,
          to,
        } satisfies ShuffleFlight;
      })
      .filter((flight): flight is ShuffleFlight => Boolean(flight));

    if (measuredFlights.length !== items.length) {
      setItems(layout);
      return;
    }

    let committed = false;
    const startedAt = performance.now();
    const totalMs = SHUFFLE_BLEND_MS * 2 + SHUFFLE_TRAVEL_MS;

    setIsShuffling(true);
    onShuffleChange(true);
    setShuffleBlend(0);
    setFlights(measuredFlights);

    const step = (now: number) => {
      const elapsed = Math.min(now - startedAt, totalMs);

      if (elapsed < SHUFFLE_BLEND_MS) {
        const blend = easeBlend(elapsed / SHUFFLE_BLEND_MS);
        setShuffleBlend(blend);
        setFlights(measuredFlights.map((flight) => ({ ...flight, rect: flight.rect })));
      } else if (elapsed < SHUFFLE_BLEND_MS + SHUFFLE_TRAVEL_MS) {
        if (!committed) {
          committed = true;
          setItems(layout);
        }

        const travelElapsed = elapsed - SHUFFLE_BLEND_MS;
        const travelProgress = easeInOut(travelElapsed / SHUFFLE_TRAVEL_MS);

        setShuffleBlend(1);
        setFlights(
          measuredFlights.map((flight) => ({
            ...flight,
            rect: interpolateRect(flight.rect, flight.to, travelProgress),
          })),
        );
      } else {
        if (!committed) {
          committed = true;
          setItems(layout);
        }

        const exitElapsed = elapsed - SHUFFLE_BLEND_MS - SHUFFLE_TRAVEL_MS;
        const blend = 1 - easeBlend(exitElapsed / SHUFFLE_BLEND_MS);

        setShuffleBlend(blend);
        setFlights(measuredFlights.map((flight) => ({ ...flight, rect: flight.to })));
      }

      if (elapsed < totalMs) {
        animationFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      setFlights([]);
      setShuffleBlend(0);
      setIsShuffling(false);
      onShuffleChange(false);
      animationFrameRef.current = null;
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  }, [
    blockedRects,
    grid,
    isShuffling,
    items,
    navHeight,
    onShuffleChange,
    prefersReducedMotion,
    tileSize,
  ]);

  return (
    <>
      <form
        id="about-photo-randomize"
        onSubmit={(event) => {
          event.preventDefault();
          randomize();
        }}
      />
      <div aria-hidden="true">
        {items.map((item) => (
          <AboutPhotoBlock
            key={item.id}
            item={item}
            navHeight={navHeight}
            opacity={
              !imagesReady || introBlend > 0
                ? 0
                : flights.some((flight) => flight.id === item.id)
                  ? 1 - shuffleBlend
                  : 1
            }
            refCallback={(node) => {
              if (node) {
                itemRefs.current.set(item.id, node);
              } else {
                itemRefs.current.delete(item.id);
              }
            }}
            tileSize={tileSize}
          />
        ))}
      </div>
      {imagesReady && introBlend > 0
        ? items.map((item) => {
            const targetRect = gridBlockToViewportRect(item, navHeight, tileSize);
            const originRect = {
              height: targetRect.height,
              left: introOrigin.x - targetRect.width / 2,
              top: introOrigin.y - targetRect.height / 2,
              width: targetRect.width,
            };
            const progress = 1 - introBlend;
            const easedProgress = easeInOut(progress);
            const rect = interpolateRect(originRect, targetRect, easedProgress);

            return (
              <div
                aria-hidden="true"
                key={`intro-${item.id}`}
                style={{
                  height: rect.height,
                  left: rect.left,
                  opacity: 1,
                  pointerEvents: "none",
                  position: "fixed",
                  top: rect.top,
                  transform: `scale(${FLYOUT_SCALE})`,
                  transformOrigin: "center",
                  width: rect.width,
                  willChange: "left, top, width, height, opacity, transform",
                  zIndex: 40,
                }}
              >
                <PhotoSurface alt={item.alt} src={item.src} />
              </div>
            );
          })
        : null}
      {flights.map((flight) => (
        <div
          aria-hidden="true"
          key={flight.id}
          style={{
            height: flight.rect.height,
            left: flight.rect.left,
            opacity: shuffleBlend,
            pointerEvents: "none",
            position: "fixed",
            top: flight.rect.top,
            transform: `scale(${1 + (FLYOUT_SCALE - 1) * shuffleBlend})`,
            transformOrigin: "center",
            width: flight.rect.width,
            willChange: "left, top, width, height, opacity, transform",
            zIndex: 40,
          }}
        >
          <PhotoSurface alt={flight.alt} src={flight.src} />
          <div
            style={{
              background: `rgba(0, 0, 0, ${DIM_OPACITY * shuffleBlend})`,
              borderRadius: 0,
              inset: 0,
              position: "absolute",
            }}
          />
        </div>
      ))}
    </>
  );
}

function AboutPhotoBlock({
  item,
  navHeight,
  opacity,
  refCallback,
  tileSize,
}: {
  item: AboutPhotoItem;
  navHeight: number;
  opacity: number;
  refCallback: (node: HTMLDivElement | null) => void;
  tileSize: number;
}) {
  return (
    <div
      ref={refCallback}
      style={{
        height: item.spanH * tileSize,
        left: item.cellI * tileSize,
        opacity,
        pointerEvents: "none",
        position: "absolute",
        top: navHeight + item.cellJ * tileSize,
        width: item.spanW * tileSize,
        zIndex: 12,
      }}
    >
      <PhotoSurface alt={item.alt} src={item.src} />
    </div>
  );
}

function gridBlockToClientRect(item: AboutPhotoItem, navHeight: number, tileSize: number) {
  return {
    height: item.spanH * tileSize,
    left: item.cellI * tileSize - window.scrollX,
    top: navHeight + item.cellJ * tileSize - window.scrollY,
    width: item.spanW * tileSize,
  };
}

function gridBlockToViewportRect(item: AboutPhotoItem, navHeight: number, tileSize: number) {
  return {
    height: item.spanH * tileSize,
    left: item.cellI * tileSize,
    top: navHeight + item.cellJ * tileSize,
    width: item.spanW * tileSize,
  };
}

function interpolateRect(from: MeasuredRect, to: MeasuredRect, progress: number) {
  return {
    height: lerp(from.height, to.height, progress),
    left: lerp(from.left, to.left, progress),
    top: lerp(from.top, to.top, progress),
    width: lerp(from.width, to.width, progress),
  };
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function easeInOut(progress: number) {
  const t = clamp01(progress);

  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function easeBlend(progress: number) {
  const t = clamp01(progress);

  return t * t * (3 - 2 * t);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
