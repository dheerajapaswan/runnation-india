import { ShieldCheck } from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { SITE } from "@/data/site";

/** Stylised GPS-route scene. Replaced automatically when SITE.heroImage is set. */
function RouteScene() {
  return (
    <svg
      viewBox="0 0 600 720"
      role="img"
      aria-label="A glowing GPS running route over a dark topographic map"
      className="absolute inset-0 size-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="hv-glow" cx="68%" cy="30%" r="65%">
          <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#ff5a1f" stopOpacity="0.1" />
          <stop offset="1" stopColor="#08080a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hv-route" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffd2bd" />
        </linearGradient>
        <filter id="hv-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <rect width="600" height="720" fill="#0c0c0f" />
      <rect width="600" height="720" fill="url(#hv-glow)" />
      <g fill="none" stroke="#f3f0e9" strokeOpacity="0.07" strokeWidth="1">
        {Array.from({ length: 11 }, (_, i) => (
          <ellipse key={i} cx="410" cy="230" rx={40 + i * 42} ry={30 + i * 36} transform={`rotate(${-18 + i * 2.5} 410 230)`} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={`b${i}`} cx="120" cy="620" rx={30 + i * 38} ry={22 + i * 28} transform={`rotate(${22 - i * 3} 120 620)`} />
        ))}
      </g>
      <g stroke="#f3f0e9" strokeOpacity="0.05">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="720" />
        ))}
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} />
        ))}
      </g>
      <path
        d="M70 640 C 170 620, 140 520, 240 500 S 400 540, 380 430 S 250 360, 330 270 S 470 240, 500 130"
        fill="none"
        stroke="#ff5a1f"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.55"
        filter="url(#hv-blur)"
      />
      <path
        className="route-draw"
        d="M70 640 C 170 620, 140 520, 240 500 S 400 540, 380 430 S 250 360, 330 270 S 470 240, 500 130"
        fill="none"
        stroke="url(#hv-route)"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength="1600"
      />
      <circle cx="70" cy="640" r="7" fill="#f3f0e9" />
      <circle cx="500" cy="130" r="9" fill="#ff5a1f" />
      <circle cx="500" cy="130" r="9" fill="none" stroke="#ff5a1f" strokeWidth="2" style={{ transformOrigin: "500px 130px", animation: "pulse-ring 2.4s ease-out infinite" }} />
    </svg>
  );
}

export function HeroVisual() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/10 bg-charcoal shadow-[0_40px_120px_-40px_rgb(255_90_31/0.45)] sm:aspect-[5/4] lg:aspect-[4/5]">
      <MediaImage
        src={SITE.heroImage}
        alt="A runner at dawn on an empty road"
        priority
        sizes="(min-width:1024px) 45vw, 100vw"
        fallback={<RouteScene />}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

      <div className="absolute left-4 top-4 flex items-center gap-2 border border-white/15 bg-ink/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" /> Live route
      </div>

      <div className="absolute inset-x-4 bottom-4 border border-white/15 bg-ink/65 p-4 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-mist">Your distance</p>
            <p className="font-display text-5xl font-extrabold leading-none sm:text-6xl">
              10<span className="text-accent">K</span>
            </p>
          </div>
          <dl className="flex gap-6 text-right">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.22em] text-mist">Pace</dt>
              <dd className="font-display text-2xl font-bold">4:32<span className="text-sm text-mist">/km</span></dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.22em] text-mist">Time</dt>
              <dd className="font-display text-2xl font-bold">45:20</dd>
            </div>
          </dl>
        </div>
        <p className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          <ShieldCheck aria-hidden className="size-4" /> Proof verified
        </p>
      </div>
    </div>
  );
}
