"use client";

import { useId } from "react";

/**
 * MapleFlagBg — a Canadian flag that ripples like fabric blowing in the wind.
 *
 * Uses an SVG `feTurbulence` + `feDisplacementMap` filter (with an animated
 * `baseFrequency`) to create a real cloth-wave distortion, plus a gentle CSS
 * skew/rotate sway on top for the "wind" feel.
 *
 * variant="site"  → fixed, full viewport, very subtle (behind everything)
 * variant="hero"  → absolute within its parent, more prominent
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
  const finalOpacity = opacity ?? (isSite ? 0.13 : 0.2);

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
          {/* Cloth-wave distortion: animated turbulence drives a displacement map */}
          <filter
            id={filterId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.013 0.045"
              numOctaves="2"
              seed="5"
              result="turb"
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.013 0.045; 0.02 0.06; 0.013 0.045"
                repeatCount="indefinite"
              />
              <animate
                attributeName="seed"
                dur="18s"
                values="5; 11; 5"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in2="turb"
              in="SourceGraphic"
              scale={isSite ? 70 : 140}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* The Canadian flag: red side panels, white center, red maple leaf */}
          <symbol id={flagSymId} viewBox="0 0 200 100">
            <rect x="0" y="0" width="50" height="100" fill="#D52B1E" />
            <rect x="150" y="0" width="50" height="100" fill="#D52B1E" />
            <rect x="50" y="0" width="100" height="100" fill="#ffffff" />
            <path
              d="M 100,12 L 106,40 L 133,32 L 121,56 L 145,60 L 126,75 L 135,95 L 100,80 L 65,95 L 74,75 L 55,60 L 79,56 L 67,32 L 94,40 Z"
              fill="#D52B1E"
            />
          </symbol>
        </defs>

        {/* The waving group — filter ripples the fabric, CSS adds a gentle sway */}
        <g
          filter={`url(#${filterId})`}
          style={{
            transformOrigin: "center center",
            animation: "flag-sway 9s ease-in-out infinite",
          }}
        >
          {isSite ? (
            <>
              <use href={`#${flagSymId}`} x="-250" y="-100" width="1050" height="525" />
              <use href={`#${flagSymId}`} x="850" y="140" width="1050" height="525" />
              <use href={`#${flagSymId}`} x="250" y="500" width="1050" height="525" />
              <use href={`#${flagSymId}`} x="-150" y="560" width="900" height="450" />
            </>
          ) : (
            <use href={`#${flagSymId}`} x="250" y="100" width="1100" height="550" />
          )}
        </g>
      </svg>
    </div>
  );
}
