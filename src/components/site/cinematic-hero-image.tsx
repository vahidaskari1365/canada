"use client";

import { useMemo } from "react";

/**
 * CinematicHeroImage — the canada.webp artwork rendered full-bleed with
 * layered motion-graphic effects:
 *
 *  - Ken-Burns slow push-in (the image breathes)
 *  - Animated diagonal light sheen (lens flare sweeping across)
 *  - Floating dust particles (cinematic atmosphere)
 *  - Breathing vignette around the edges
 *  - Gradient scrims top & bottom for text legibility + cinematic fade
 *
 * The element fills its parent absolutely (use inside a `relative` container).
 */
export function CinematicHeroImage({ src = "/canada.webp" }: { src?: string }) {
  // Pre-compute particle positions so they're stable per mount.
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        left: `${(i * 53) % 100}%`,
        top: `${(i * 37 + 12) % 100}%`,
        size: 1 + ((i * 7) % 3),
        dx: `${((i * 13) % 60) - 30}px`,
        dy: `${-80 - ((i * 17) % 120)}px`,
        delay: `${(i * 0.7) % 9}s`,
        dur: `${9 + ((i * 3) % 7)}s`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Layer 1: the image with Ken-Burns push-in */}
      <div className="absolute inset-0 hero-kenburns">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 35%" }}
        />
      </div>

      {/* Layer 2: warm color grade — slight crimson wash + contrast */}
      <div className="absolute inset-0 bg-primary/15 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-amber-200/10 mix-blend-overlay" />

      {/* Layer 3: animated diagonal light sheen (lens flare) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="hero-sheen absolute top-0 h-full w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* Layer 4: floating dust particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                "--dx": p.dx,
                "--dy": p.dy,
                animation: `hero-dust ${p.dur} ease-in-out ${p.delay} infinite`,
                boxShadow: "0 0 4px rgba(255,255,255,0.7)",
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
      {/* Left-to-right scrim (text side gets darker) */}
      <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-background/95 via-background/55 to-transparent" />
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/60 to-transparent" />
      {/* Bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
}
