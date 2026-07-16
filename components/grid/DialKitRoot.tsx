"use client";

import { DialRoot } from "dialkit";

export function DialKitRoot() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <DialRoot />;
}
