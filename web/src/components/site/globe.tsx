"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

// [latitude, longitude]
const CITIES = {
  mumbai: [19.076, 72.8777],
  dubai: [25.2048, 55.2708],
  rotterdam: [51.9244, 4.4777],
  shanghai: [31.2304, 121.4737],
  singapore: [1.3521, 103.8198],
  newYork: [40.7128, -74.006],
  sydney: [-33.8688, 151.2093],
} as const satisfies Record<string, [number, number]>;

const BRASS: [number, number, number] = [0.91, 0.72, 0.31];

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let size = canvas.offsetWidth;
    let phi = 4.4; // starts facing India / Middle East / Europe
    let frame = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi,
      theta: 0.25,
      dark: 0,
      diffuse: 1.3,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.96, 0.94, 0.9],
      markerColor: [0.85, 0.26, 0.18],
      glowColor: [0.92, 0.88, 0.8],
      markers: [
        { location: [...CITIES.mumbai], size: 0.07 },
        { location: [...CITIES.dubai], size: 0.04 },
        { location: [...CITIES.rotterdam], size: 0.05 },
        { location: [...CITIES.shanghai], size: 0.05 },
        { location: [...CITIES.singapore], size: 0.04 },
        { location: [...CITIES.newYork], size: 0.05 },
        { location: [...CITIES.sydney], size: 0.04 },
      ],
      arcs: [
        { from: [...CITIES.mumbai], to: [...CITIES.rotterdam] },
        { from: [...CITIES.mumbai], to: [...CITIES.dubai] },
        { from: [...CITIES.mumbai], to: [...CITIES.singapore] },
        { from: [...CITIES.singapore], to: [...CITIES.shanghai] },
        { from: [...CITIES.rotterdam], to: [...CITIES.newYork] },
        { from: [...CITIES.singapore], to: [...CITIES.sydney] },
      ],
      arcColor: BRASS,
      arcWidth: 0.6,
      arcHeight: 0.3,
      markerElevation: 0.02,
    });

    const onResize = () => {
      size = canvas.offsetWidth;
      globe.update({ width: size * dpr, height: size * dpr });
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      phi += 0.0035;
      globe.update({ phi });
      frame = requestAnimationFrame(tick);
    };
    if (!reduceMotion) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", aspectRatio: "1 / 1" }}
      aria-label="Globe showing animated trade routes between major ports"
      role="img"
    />
  );
}