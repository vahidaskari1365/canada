"use client";

import { useMemo } from "react";

/**
 * CinematicHeroImage — the canada.webp artwork rendered with layered
 * motion-graphic effects (performance-tuned).
 *
 *  - Ken-Burns slow push-in (GPU-only transform)
 *  - Animated diagonal light sheen (single transform)
 *  - Floating dust particles (limited count, GPU transform)
 *  - Breathing vignette around the edges
 *  - Gradient scrims for text legibility
 *
 * The element fills its parent absolutely (use inside a `relative` container).
 *
 * Props:
 *  - src: image URL (default /canada.webp)
 *  - variant: "hero" (full-bleed, side scrim) | "box" (framed card, center scrim)
 *  - particleCount: how many dust particles (default 10)
 *  - scrimOpacity: 0..1 intensity of the darkening scrim (default 0.55)
 */
export function CinematicHeroImage({
  src = "/canada.webp",
  variant = "hero",
  particleCount = 10,
  scrimOpacity = 0.55,
}: {
  src?: string;
  variant?: "hero" | "box";
  particleCount?: number;
  scrimOpacity?: number;
}) {
  const isBox = variant === "box";

  // Pre-compute particle positions so they're stable per mount.
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }).map((_, i) => ({
        left: `${(i * 53) % 100}%`,
        top: `${(i * 37 + 12) % 100}%`,
        size: 1 + ((i * 7) % 3),
        dx: `${((i * 13) % 60) - 30}px`,
        dy: `${-60 - ((i * 17) % 100)}px`,
        delay: `${(i * 0.7) % 9}s`,
        dur: `${9 + ((i * 3) % 7)}s`,
      })),
    [particleCount]
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Layer 1: the image with Ken-Burns push-in (eager + high priority for LCP) */}
      <div className="absolute inset-0 hero-kenburns">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          loading="eager"
          // @ts-expect-error fetchPriority is valid HTML but not in React types yet
          fetchpriority="high"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: isBox ? "center 30%" : "center 35%" }}
        />
      </div>

      {/* Layer 2: warm color grade — slight crimson wash + contrast */}
      <div className="absolute inset-0 bg-primary/15 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-amber-200/10 mix-blend-overlay" />

      {/* Layer 3: animated diagonal light sheen (lens flare) — GPU transform only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="hero-sheen absolute top-0 h-full w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
            filter: "blur(8px)",
            willChange: "transform, opacity",
          }}
        />
      </div>

      {/* Layer 4: floating dust particles — pure transform, no box-shadow */}
      <div className="pointer-events-none absolute inset-0" style={{ willChange: "transform" }}>
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/80"
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                "--dx": p.dx,
                "--dy": p.dy,
                animation: `hero-dust ${p.dur} ease-in-out ${p.delay} infinite`,
                willChange: "transform, opacity",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Layer 5: breathing vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 100%)",
          animation: "hero-vignette 8s ease-in-out infinite",
        }}
      />

      {/* Layer 6: scrims for text legibility + cinematic fades */}
      {isBox ? (
        <>
          {/* darker overall scrim so white text reads on the framed card */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${scrimOpacity})` }}
          />
          {/* subtle bottom gradient for depth */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        </>
      ) : (
        <>
          {/* Left-to-right scrim (text side gets darker) */}
          <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-background/95 via-background/55 to-transparent" />
          {/* Top fade */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/60 to-transparent" />
          {/* Bottom fade into the page */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </>
      )}
    </div>
  );
}
