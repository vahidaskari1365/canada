"use client";

import { useId } from "react";

/**
 * MapleFlagBg — a clearly recognizable Canadian flag that gently ripples
 * like fabric blowing in the wind.
 *
 * Design decisions (after feedback that the flag was unrecognizable):
 *  - The flag is drawn at the correct 2:1 ratio with 1/4-width red side
 *    panels and the official 11-point maple leaf centered on white.
 *  - The displacement scale is kept LOW (just enough to ripple the edges)
 *    so the flag silhouette stays unmistakably Canadian.
 *  - Opacity is high enough to read the flag, while text contrast is
 *    preserved via a soft white scrim behind content.
 *
 * variant="site"  → fixed, full viewport, subtle (behind everything)
 * variant="hero"  → absolute within parent, prominent
 */
export function MapleFlagBg({
  variant = "site",
  className = "",
  opacity,
}: {
  variant?: "site" | "hero";
  className?: string;
  opacity?: number;
}) {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, "");
  const filterId = `wave-${id}`;
  const flagSymId = `flag-${id}`;

  const isSite = variant === "site";
  const finalOpacity = opacity ?? (isSite ? 0.22 : 0.55);

  return (
    <div
      aria-hidden="true"
      className={`maple-flag-bg maple-flag-${variant} ${className}`}
      style={{
        position: isSite ? "fixed" : "absolute",
        inset: 0,
        zIndex: isSite ? 0 : 0,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: finalOpacity,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          {/* Gentle cloth ripple — small scale keeps the flag recognizable */}
          <filter
            id={filterId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.022"
              numOctaves="2"
              seed="3"
              result="turb"
            >
              <animate
                attributeName="baseFrequency"
                dur="11s"
                values="0.008 0.022; 0.011 0.03; 0.008 0.022"
                repeatCount="indefinite"
              />
              <animate
                attributeName="seed"
                dur="22s"
                values="3; 9; 3"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in2="turb"
              in="SourceGraphic"
              scale={isSite ? 22 : 34}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/*
            The official Canadian flag — 2:1 ratio.
            Red side panels are each 1/4 of the width (0-500, 1100-2000),
            white center is 1/2 (500-1100). The 11-point maple leaf sits
            centered on the white field.
          */}
          <symbol id={flagSymId} viewBox="0 0 200 100">
            {/* red side panels */}
            <rect x="0" y="0" width="50" height="100" fill="#D52B1E" />
            <rect x="150" y="0" width="50" height="100" fill="#D52B1E" />
            {/* white center */}
            <rect x="50" y="0" width="100" height="100" fill="#ffffff" />
            {/*
              11-point maple leaf — the official Canadian flag leaf,
              centered at (100, 50), drawn to span roughly y=14..86.
              Path is a faithful approximation of the canonical leaf.
            */}
            <path
              transform="translate(100, 50) scale(0.42) translate(-100, -50)"
              fill="#D52B1E"
              d="M 100,2
                 L 107.5,30
                 L 137,22
                 L 124,48
                 L 153,46
                 L 131,66
                 L 156,78
                 L 130,84
                 L 138,108
                 L 115,96
                 L 113,122
                 L 100,108
                 L 87,122
                 L 85,96
                 L 62,108
                 L 70,84
                 L 44,78
                 L 69,66
                 L 47,46
                 L 76,48
                 L 63,22
                 L 92.5,30
                 Z"
            />
          </symbol>
        </defs>

        {/* The waving group — gentle filter ripple + CSS sway */}
        <g
          filter={`url(#${filterId})`}
          style={{
            transformOrigin: "center center",
            animation: "flag-sway 11s ease-in-out infinite",
          }}
        >
          {isSite ? (
            <>
              <use href={`#${flagSymId}`} x="900" y="-60" width="900" height="450" />
              <use href={`#${flagSymId}`} x="-200" y="280" width="800" height="400" />
              <use href={`#${flagSymId}`} x="780" y="500" width="900" height="450" />
            </>
          ) : (
            <use href={`#${flagSymId}`} x="350" y="180" width="900" height="450" />
          )}
        </g>
      </svg>
    </div>
  );
}
