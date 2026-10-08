import { ImageResponse } from "next/og";
import { HttpError, handle, requireSession } from "@/server/http";
import { db } from "@/lib/db";
import { getDistance } from "@/data/distances";
import { UPCOMING_EVENT } from "@/data/event";
import { DISTANCE_FROM_DB, secondsToTime } from "@/server/mappers";
import { formatLongDate } from "@/lib/utils";

const W = 1600;
const H = 1130;
const ORANGE = "#ff5a1f";
const BONE = "#f3f0e9";
const MIST = "#9a9aa3";

/** Faux-bold: the image font has one weight, so same-colour offset shadows thicken the glyphs. */
const bold = (px: number, color = BONE, extra = "") => {
  const o = Math.max(0.6, px / 2);
  const shadow = [`${o}px 0 0 ${color}`, `-${o}px 0 0 ${color}`, `0 ${o}px 0 ${color}`, `0 -${o}px 0 ${color}`].join(", ");
  return { color, textShadow: extra ? `${shadow}, ${extra}` : shadow } as const;
};

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const v = pos[0] === "t" ? { top: 70 } : { bottom: 70 };
  const h = pos[1] === "l" ? { left: 70 } : { right: 70 };
  const bw = { [pos[0] === "t" ? "borderTop" : "borderBottom"]: `6px solid ${ORANGE}`, [pos[1] === "l" ? "borderLeft" : "borderRight"]: `6px solid ${ORANGE}` };
  return <div style={{ display: "flex", position: "absolute", width: 90, height: 90, ...v, ...h, ...bw }} />;
}

/** Seal: concentric rings, sunrise and route (drawn, no text in SVG), with a FINISHER sash on top. */
function Seal() {
  return (
    <div style={{ display: "flex", position: "relative", width: 196, height: 196, alignItems: "center", justifyContent: "center" }}>
      <svg width="196" height="196" viewBox="-115 -115 230 230">
        <defs>
          <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6f6f8" />
            <stop offset="0.3" stopColor="#8d8d95" />
            <stop offset="0.55" stopColor="#e4e4e9" />
            <stop offset="1" stopColor="#62626a" />
          </linearGradient>
          <radialGradient id="f" cx="35%" cy="25%" r="85%">
            <stop offset="0" stopColor="#34343b" />
            <stop offset="1" stopColor="#09090b" />
          </radialGradient>
          <radialGradient id="s" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffb27a" />
            <stop offset="0.6" stopColor="#ff5a1f" />
            <stop offset="1" stopColor="#d9400c" />
          </radialGradient>
        </defs>
        <circle r="112" fill="url(#m)" />
        <circle r="106" fill="none" stroke="#0a0a0c" strokeOpacity="0.5" strokeWidth="7" strokeDasharray="1.6 3.6" />
        <circle r="97" fill="url(#m)" />
        <circle r="93" fill="url(#f)" />
        <circle r="84" fill="none" stroke="#f3f0e9" strokeOpacity="0.4" strokeWidth="4" strokeDasharray="0.7 4.4" />
        <circle r="66" fill="none" stroke="#ff5a1f" strokeOpacity="0.55" strokeWidth="1.5" />
        <circle cx="22" cy="-22" r="20" fill="url(#s)" />
        <path d="M-50 22 H-22 M-42 31 H-24 M-34 40 H-26" stroke="#f3f0e9" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
        <path d="M-44 44 C -22 34 4 52 16 14 S 24 -6 22 -22" fill="none" stroke="#ff5a1f" strokeWidth="7" strokeLinecap="round" />
        <circle cx="22" cy="-22" r="6" fill="#f3f0e9" />
      </svg>
      <div style={{ display: "flex", position: "absolute", bottom: 20, left: -14, right: -14, height: 38, background: "linear-gradient(#ff7a45, #e0470f)", alignItems: "center", justifyContent: "center", fontSize: 22, letterSpacing: 6, ...bold(1, "#0a0a0c") }}>
        FINISHER
      </div>
    </div>
  );
}

/** Digital E-certificate (PNG). Only issued to the signed-in participant once their proof is approved. */
export async function GET() {
  return handle(async () => {
    const id = await requireSession("participant");
    const reg = await db.registration.findUnique({ where: { id }, include: { proof: true } });
    if (!reg) throw new HttpError(404, "Registration not found");
    if (!reg.certificateIssued || reg.proof?.status !== "APPROVED") {
      throw new HttpError(403, "Your certificate is available once your proof is approved.");
    }

    const distance = getDistance(DISTANCE_FROM_DB[reg.distance]);
    const name = reg.fullName.length > 30 ? reg.fullName.slice(0, 29) + "…" : reg.fullName;
    const nameSize = name.length > 22 ? 84 : 112;

    const png = new ImageResponse(
      (
        <div style={{ width: W, height: H, display: "flex", position: "relative", background: "#08080a", color: BONE }}>
          {/* background: glow + guilloche rings + corner hatching */}
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", top: 0, left: 0 }}>
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.28" />
                <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="1380" cy="140" r="520" fill="url(#glow)" />
            <circle cx="220" cy="1040" r="420" fill="url(#glow)" />
            {Array.from({ length: 14 }, (_, i) => (
              <circle key={i} cx="800" cy="570" r={90 + i * 46} fill="none" stroke="#f3f0e9" strokeOpacity="0.035" strokeWidth="1.5" />
            ))}
            {Array.from({ length: 16 }, (_, i) => (
              <line key={i} x1={70 + i * 18} y1="70" x2={70} y2={70 + i * 18} stroke="#ff5a1f" strokeOpacity="0.18" strokeWidth="1.5" />
            ))}
            {Array.from({ length: 16 }, (_, i) => (
              <line key={`b${i}`} x1={W - 70 - i * 18} y1={H - 70} x2={W - 70} y2={H - 70 - i * 18} stroke="#ff5a1f" strokeOpacity="0.18" strokeWidth="1.5" />
            ))}
          </svg>

          {/* frames */}
          <div style={{ display: "flex", position: "absolute", top: 34, left: 34, right: 34, bottom: 34, border: `2px solid ${ORANGE}` }} />
          <div style={{ display: "flex", position: "absolute", top: 54, left: 54, right: 54, bottom: 54, border: "1px solid rgba(243,240,233,0.28)" }} />
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          {/* header */}
          <div style={{ display: "flex", position: "absolute", top: 92, left: 0, right: 0, justifyContent: "center", fontSize: 38, letterSpacing: 14, ...bold(0.9) }}>
            RUNNATION<span style={{ marginLeft: 18, ...bold(0.9, ORANGE) }}>INDIA</span>
          </div>

          {/* title */}
          <div style={{ display: "flex", position: "absolute", top: 158, left: 0, right: 0, justifyContent: "center", fontSize: 138, letterSpacing: 20, lineHeight: 1, ...bold(3) }}>
            CERTIFICATE
          </div>
          <div style={{ display: "flex", position: "absolute", top: 312, left: 0, right: 0, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 150, height: 2, background: ORANGE }} />
            <div style={{ display: "flex", margin: "0 28px", fontSize: 28, letterSpacing: 14, ...bold(0.6, ORANGE) }}>OF COMPLETION</div>
            <div style={{ display: "flex", width: 150, height: 2, background: ORANGE }} />
          </div>

          {/* body */}
          <div style={{ display: "flex", position: "absolute", top: 384, left: 0, right: 0, justifyContent: "center", fontSize: 28, letterSpacing: 4, color: MIST }}>This is to certify that</div>
          <div style={{ display: "flex", position: "absolute", top: 428, left: 90, right: 90, justifyContent: "center", fontSize: nameSize, lineHeight: 1.1, textAlign: "center", ...bold(2.4) }}>{name}</div>
          <div style={{ display: "flex", position: "absolute", top: 574, left: 0, right: 0, justifyContent: "center", alignItems: "center" }}>
            <div style={{ display: "flex", width: 120, height: 2, background: "linear-gradient(90deg, transparent, #ff5a1f)" }} />
            <div style={{ display: "flex", width: 14, height: 14, margin: "0 18px", background: ORANGE, transform: "rotate(45deg)" }} />
            <div style={{ display: "flex", width: 120, height: 2, background: "linear-gradient(90deg, #ff5a1f, transparent)" }} />
          </div>
          <div style={{ display: "flex", position: "absolute", top: 610, left: 0, right: 0, justifyContent: "center", fontSize: 28, letterSpacing: 4, color: MIST }}>has successfully completed the</div>
          <div style={{ display: "flex", position: "absolute", top: 650, left: 0, right: 0, justifyContent: "center", fontSize: 108, letterSpacing: 6, ...bold(5, ORANGE) }}>
            {distance.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", position: "absolute", top: 782, left: 0, right: 0, justifyContent: "center", fontSize: 30, letterSpacing: 8, ...bold(0.5) }}>{UPCOMING_EVENT.name}</div>

          {/* footer: time | seal | date */}
          <div style={{ display: "flex", position: "absolute", top: 838, left: 150, right: 150, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 360 }}>
              <div style={{ display: "flex", fontSize: 20, letterSpacing: 7, color: MIST }}>FINISH TIME</div>
              <div style={{ display: "flex", fontSize: 76, marginTop: 6, ...bold(1.6) }}>{secondsToTime(reg.proof.finishSeconds)}</div>
            </div>
            <Seal />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 360 }}>
              <div style={{ display: "flex", fontSize: 20, letterSpacing: 7, color: MIST }}>RUN DATE</div>
              <div style={{ display: "flex", fontSize: 54, marginTop: 14, ...bold(1.2) }}>{formatLongDate(reg.proof.runDate.toISOString())}</div>
            </div>
          </div>
          <div style={{ display: "flex", position: "absolute", bottom: 66, left: 0, right: 0, justifyContent: "center", fontSize: 20, letterSpacing: 6, color: MIST }}>
            CERTIFICATE ID  <span style={{ marginLeft: 14, color: BONE }}>{reg.code}</span>
          </div>
        </div>
      ),
      {
        width: W,
        height: H,
        headers: {
          "Content-Disposition": `attachment; filename="RunNation-Certificate-${reg.code}.png"`,
          "Cache-Control": "private, no-store",
        },
      },
    );
    return png as never;
  });
}
