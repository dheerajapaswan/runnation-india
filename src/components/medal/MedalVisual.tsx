/** Product-style metallic medal. Replaced when SITE.medalImage is set. */
export function MedalVisual() {
  return (
    <svg
      viewBox="0 0 400 560"
      role="img"
      aria-label="RunNation India finisher medal on an orange ribbon"
      className="h-full w-full drop-shadow-[0_40px_60px_rgb(0_0_0/0.7)]"
    >
      <defs>
        <linearGradient id="md-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2f2f4" />
          <stop offset="0.28" stopColor="#8d8d95" />
          <stop offset="0.5" stopColor="#d9d9de" />
          <stop offset="0.78" stopColor="#5b5b62" />
          <stop offset="1" stopColor="#b8b8be" />
        </linearGradient>
        <linearGradient id="md-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b2b31" />
          <stop offset="1" stopColor="#0d0d10" />
        </linearGradient>
        <linearGradient id="md-ribbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6a33" />
          <stop offset="1" stopColor="#c93f0e" />
        </linearGradient>
        <radialGradient id="md-gloss" cx="30%" cy="22%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d="M120 0h72l30 250h-76z" fill="url(#md-ribbon)" />
      <path d="M208 0h72l-26 250h-76z" fill="#16161a" />
      <path d="M120 0h72l8 70h-72z M208 0h72l-6 70h-74z" fill="#000" opacity="0.18" />
      <path d="M156 26l44 40 44-40" fill="none" stroke="#f3f0e9" strokeOpacity="0.5" strokeWidth="2" />
      <rect x="176" y="236" width="48" height="36" rx="6" fill="url(#md-metal)" />

      <g transform="translate(200 390)">
        <circle r="156" fill="url(#md-metal)" />
        <circle r="156" fill="none" stroke="#0a0a0c" strokeOpacity="0.55" strokeWidth="8" strokeDasharray="2.2 5" />
        <circle r="136" fill="url(#md-dark)" />
        <circle r="136" fill="none" stroke="url(#md-metal)" strokeWidth="3" />
        <circle r="118" fill="none" stroke="#ff5a1f" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
        <path d="M-70 40 Q -20 -90 20 -20 T 78 -62" fill="none" stroke="#ff5a1f" strokeWidth="9" strokeLinecap="round" />
        <circle cx="78" cy="-62" r="11" fill="#f3f0e9" />
        <text y="78" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="54" fill="#f3f0e9" letterSpacing="2">FINISHER</text>
        <text y="104" textAnchor="middle" fontFamily="var(--font-body), sans-serif" fontWeight="600" fontSize="11" fill="#9a9aa3" letterSpacing="6">RUNNATION · 2026</text>
        <circle r="156" fill="url(#md-gloss)" />
      </g>
    </svg>
  );
}
