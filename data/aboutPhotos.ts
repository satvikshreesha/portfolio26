export type AboutPhotoSeed = {
  id: string;
  alt: string;
  baseSpanW: number;
  baseSpanH: number;
  src?: string;
};

export const ABOUT_PHOTOS: AboutPhotoSeed[] = [
  {
    id: "downtown-lights",
    alt: "Satvik downtown at night with lights",
    baseSpanW: 3,
    baseSpanH: 5,
    src: "/about/downtown-lights.png",
  },
  {
    id: "cabo-hike",
    alt: "Satvik sitting above the coastline in Cabo",
    baseSpanW: 5,
    baseSpanH: 4,
    src: "/about/cabo-hike.png",
  },
  {
    id: "figma-campus",
    alt: "Satvik at a Figma campus event",
    baseSpanW: 5,
    baseSpanH: 3,
    src: "/about/figma-campus.png",
  },
];
