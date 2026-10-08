import { ImageResponse } from "next/og";
import { HttpError, handle, requireSession } from "@/server/http";
import { db } from "@/lib/db";
import { getDistance } from "@/data/distances";
import { DISTANCE_FROM_DB } from "@/server/mappers";

const W = 1600;
const H = 1000;
const ORANGE = "#ff5a1f";
const BONE = "#f3f0e9";
const INK = "#0a0a0c";
const MIST = "#9a9aa3";

/** Faux-bold: the image font has one weight, so same-colour offset shadows thicken the glyphs. */
const bold = (px: number, color = INK, extra = "") => {
  const o = Math.max(0.6, px / 2);
  const shadow = [`${o}px 0 0 ${color}`, `-${o}px 0 0 ${color}`, `0 ${o}px 0 ${color}`, `0 -${o}px 0 ${color}`].join(", ");
  return { color, textShadow: extra ? `${shadow}, ${extra}` : shadow } as const;
};

/** Deterministic barcode-style stripes derived from the registration code. */
function barcode(seed: string): { x: number; w: number }[] {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 64; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const w = 3 + (h % 4) * 3;
    bars.push({ x, w });
    x += w + 3 + ((h >> 8) % 3) * 3;
  }
  return bars;
}

function Pin({ side }: { side: "left" | "right" }) {
  return (
    <div style={{ display: "flex", position: "absolute", top: 40, [side]: 42, width: 38, height: 38, borderRadius: 19, background: "#08080a", border: "3px solid #bdb8ac" }} />
  );
}

/** Digital E-BIB (PNG). Issued to the signed-in participant once their payment is confirmed. */
export async function GET() {
  return handle(async () => {
    const id = await requireSession("participant");
    const reg = await db.registration.findUnique({ where: { id } });
    if (!reg) throw new HttpError(404, "Registration not found");
    if (reg.paymentStatus !== "PAID") throw new HttpError(403, "Your E-BIB is available once your payment is confirmed.");

    const distance = getDistance(DISTANCE_FROM_DB[reg.distance]);
    const name = reg.fullName.toUpperCase().slice(0, 26);
    const bars = barcode(reg.code);
    const barsWidth = bars[bars.length - 1].x + bars[bars.length - 1].w;
    const numSize = String(reg.bibNumber).length > 4 ? 300 : 360;

    const png = new ImageResponse(
      (
        <div style={{ width: W, height: H, display: "flex", position: "relative", background: "#08080a", padding: 26 }}>
          <div style={{ display: "flex", position: "relative", flex: 1, flexDirection: "column", background: BONE, color: INK }}>
            {/* diagonal paper texture */}
            <svg width={W - 52} height={H - 52} viewBox={`0 0 ${W - 52} ${H - 52}`} style={{ position: "absolute", top: 0, left: 0 }}>
              {Array.from({ length: 60 }, (_, i) => (
                <line key={i} x1={i * 40 - 400} y1={H - 52} x2={i * 40 + 200} y2="0" stroke="#0a0a0c" strokeOpacity="0.035" strokeWidth="14" />
              ))}
              <circle cx={W - 300} cy="360" r="300" fill="none" stroke={ORANGE} strokeOpacity="0.14" strokeWidth="2" />
              <circle cx={W - 300} cy="360" r="240" fill="none" stroke={ORANGE} strokeOpacity="0.1" strokeWidth="2" />
              <circle cx={W - 300} cy="360" r="180" fill="none" stroke={ORANGE} strokeOpacity="0.08" strokeWidth="2" />
            </svg>

            {/* header band */}
            <div style={{ display: "flex", height: 128, background: "#0a0a0c", color: BONE, alignItems: "center", justifyContent: "space-between", padding: "0 110px" }}>
              <div style={{ display: "flex", fontSize: 48, letterSpacing: 12, ...bold(1, BONE) }}>
                RUNNATION<span style={{ marginLeft: 16, ...bold(1, ORANGE) }}>INDIA</span>
              </div>
              <div style={{ display: "flex", fontSize: 24, letterSpacing: 8, color: MIST }}>VIRTUAL RUN 2026</div>
            </div>
            <div style={{ display: "flex", height: 10, background: `linear-gradient(90deg, ${ORANGE}, #ffb020)` }} />

            <Pin side="left" />
            <Pin side="right" />

            {/* number */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 6 }}>
              <div style={{ display: "flex", fontSize: numSize, lineHeight: 1, letterSpacing: -6, ...bold(14) }}>{reg.bibNumber}</div>
              <div style={{ display: "flex", width: 300, height: 10, marginTop: 4, background: ORANGE }} />
            </div>

            {/* name */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 26, fontSize: 76, letterSpacing: 6, ...bold(1.8) }}>{name}</div>

            {/* footer */}
            <div style={{ display: "flex", position: "absolute", left: 0, right: 0, bottom: 0, height: 214, alignItems: "stretch" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 480, background: ORANGE, paddingLeft: 60 }}>
                <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, ...bold(0.4, INK) }}>DISTANCE</div>
                <div style={{ display: "flex", fontSize: distance.id === "21k" ? 70 : 108, lineHeight: 1.05, ...bold(2.4, INK) }}>{distance.name.toUpperCase()}</div>
              </div>
              <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", background: "#0a0a0c", color: BONE, padding: "0 56px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", fontSize: 18, letterSpacing: 7, color: MIST }}>REGISTRATION ID</div>
                    <div style={{ display: "flex", fontSize: 48, ...bold(1, BONE) }}>{reg.code}</div>
                  </div>
                  <div style={{ display: "flex", fontSize: 24, letterSpacing: 5, ...bold(0.6, ORANGE) }}>RUN ANYWHERE.</div>
                </div>
                <div style={{ display: "flex", position: "relative", width: barsWidth, height: 56, marginTop: 18 }}>
                  {bars.map((b, i) => (
                    <div key={i} style={{ display: "flex", position: "absolute", left: b.x, top: 0, width: b.w, height: 56, background: BONE }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: W,
        height: H,
        headers: {
          "Content-Disposition": `attachment; filename="RunNation-BIB-${reg.bibNumber}.png"`,
          "Cache-Control": "private, no-store",
        },
      },
    );
    return png as never;
  });
}
