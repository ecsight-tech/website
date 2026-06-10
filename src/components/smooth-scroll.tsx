"use client";

import { ReactLenis } from "lenis/react";

export function SmoothScroll() {
  return <ReactLenis root options={{ lerp: 0.1, anchors: true }} />;
}
