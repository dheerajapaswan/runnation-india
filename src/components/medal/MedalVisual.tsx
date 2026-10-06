import { useId } from "react";

/**
 * Premium finisher medal (SVG, no external assets).
 * Pass `distance` (e.g. "10K") to stamp it on the face; omit for the generic medal.
 * Replaced on the home page when SITE.medalImage is set.
 */
export function MedalVisual({ distance, className }: { distance?: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `${n}-${uid}`;

  return (
    <svg
      viewBox="0 0 400 560"
      role="img"
      aria-label={`RunNation India ${distance ? distance + " " : ""}finisher medal on an orange ribbon`}
      className={className ?? "h-full w-full drop-shadow-[0_40px_60px_rgb(0_0_0/0.7)]"}
    >
      <defs>
        <linearGradient id={id("metal")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f6f8" />
          <stop offset="0.22" stopColor="#9a9aa3" />
          <stop offset="0.48" stopColor="#e4e4e9" />
          <stop offset="0.74" stopColor="#62626a" />
          <stop offset="1" stopColor="#c4c4ca" />
        </linearGradient>
        <linearGradient id={id("rim")} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#8d8d95" stopOpacity="0.4" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id={id("field")} cx="35%" cy="25%" r="85%">
          <stop offset="0" stopColor="#34343b" />
          <stop offset="0.6" stopColor="#141417" />
          <stop offset="1" stopColor="#09090b" />
        </radialGradient>
        <radialGradient id={id("sun")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb27a" />
          <stop offset="0.6" stopColor="#ff5a1f" />
          <stop offset="1" stopColor="#d9400c" />
        </radialGradient>
        <linearGradient id={id("ribbon")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6a33" />
          <stop offset="1" stopColor="#c93f0e" />
        </linearGradient>
        <linearGradient id={id("band")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a45" />
          <stop offset="1" stopColor="#e0470f" />
        </linearGradient>
        <radialGradient id={id("gloss")} cx="28%" cy="20%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <path id={id("arc")} d="M -113 0 A 113 113 0 0 1 113 0" />
      </defs>

      {/* ribbon */}
      <path d="M118 0h74l32 244h-80z" fill={`url(#${id("ribbon")})`} />
      <path d="M208 0h74l-26 244h-80z" fill="#17171b" />
      <path d="M142 0 L196 244 M270 0 L226 244" stroke="#f3f0e9" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M118 0h74l5 40h-76z M208 0h74l-5 40h-74z" fill="#000" opacity="0.22" />

      {/* bail */}
      <ellipse cx="200" cy="236" rx="26" ry="14" fill="none" stroke={`url(#${id("metal")})`} strokeWidth="9" />
      <rect x="186" y="238" width="28" height="22" rx="5" fill={`url(#${id("metal")})`} />

      <g transform="translate(200 392)">
        {/* body + knurled edge */}
        <circle r="160" fill={`url(#${id("metal")})`} />
        <circle r="154" fill="none" stroke="#0a0a0c" strokeOpacity="0.5" strokeWidth="9" strokeDasharray="1.8 4.4" />
        <circle r="146" fill="none" stroke={`url(#${id("rim")})`} strokeWidth="3" />
        <circle r="140" fill={`url(#${id("metal")})`} />
        <circle r="136" fill={`url(#${id("field")})`} />
        <circle r="136" fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="3" />

        {/* fine engraved rings */}
        <g fill="none" stroke="#f3f0e9" strokeOpacity="0.05">
          {[34, 52, 70, 88].map((r) => (
            <circle key={r} r={r} />
          ))}
        </g>

        {/* bezel ticks */}
        <circle r="128" fill="none" stroke="#f3f0e9" strokeOpacity="0.45" strokeWidth="5" strokeDasharray="0.7 4.3" pathLength="360" />
        <circle r="100" fill="none" stroke="#ff5a1f" strokeOpacity="0.5" strokeWidth="1.5" />

        {/* curved legend */}
        <text fontFamily="var(--font-display), sans-serif" fontWeight="700" fontSize="17" letterSpacing="5.5" fill="#f3f0e9" textAnchor="middle">
          <textPath href={`#${id("arc")}`} startOffset="50%">
            RUNNATION INDIA · 2026
          </textPath>
        </text>

        {/* distance stamp */}
        {distance && (
          <text y="-44" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="46" letterSpacing="2" fill="#f3f0e9">
            {distance}
          </text>
        )}

        {/* emblem: sunrise + route */}
        <g transform={`translate(0 ${distance ? 18 : 2})`}>
          <circle cx="34" cy="-18" r="28" fill={`url(#${id("sun")})`} />
          <g stroke="#f3f0e9" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round">
            <path d="M-84 6 H-30" />
            <path d="M-70 16 H-34" />
            <path d="M-58 26 H-38" />
          </g>
          <path d="M-62 52 C -30 40 6 62 24 22 S 36 -6 34 -18" fill="none" stroke="#ff5a1f" strokeWidth="9" strokeLinecap="round" />
          <path d="M-62 52 C -30 40 6 62 24 22 S 36 -6 34 -18" fill="none" stroke="#f3f0e9" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
          <circle cx="34" cy="-18" r="8" fill="#f3f0e9" />
        </g>

        {/* finisher sash */}
        <g transform="translate(0 86)">
          <path d="M-132 -20 H132 L120 0 L132 20 H-132 L-120 0 Z" fill="#000" opacity="0.35" transform="translate(0 4)" />
          <path d="M-132 -20 H132 L120 0 L132 20 H-132 L-120 0 Z" fill={`url(#${id("band")})`} />
          <path d="M-132 -20 H132" stroke="#fff" strokeOpacity="0.35" />
          <text y="9" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="30" letterSpacing="7" fill="#0a0a0c">
            FINISHER
          </text>
        </g>

        <circle r="160" fill={`url(#${id("gloss")})`} />
      </g>
    </svg>
  );
}
