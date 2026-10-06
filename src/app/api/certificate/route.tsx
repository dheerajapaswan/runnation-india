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
    const name = reg.fullName.length > 38 ? reg.fullName.slice(0, 37) + "…" : reg.fullName;
    const stats: [string, string][] = [
      ["FINISH TIME", secondsToTime(reg.proof.finishSeconds)],
      ["RUN DATE", formatLongDate(reg.proof.runDate.toISOString())],
      ["CERTIFICATE ID", reg.code],
    ];

    const png = new ImageResponse(
      (
        <div style={{ width: W, height: H, display: "flex", background: "#08080a", padding: 36 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              border: `2px solid ${ORANGE}`,
              padding: "64px 80px",
              background: "radial-gradient(circle at 85% 0%, #3a1708 0%, #0c0c0f 55%)",
              color: BONE,
            }}
          >
            <div style={{ display: "flex", fontSize: 38, letterSpacing: 10, fontWeight: 800 }}>
              RUNNATION<span style={{ color: ORANGE, marginLeft: 16 }}>INDIA</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", fontSize: 30, letterSpacing: 12, color: ORANGE, fontWeight: 700 }}>CERTIFICATE OF COMPLETION</div>
              <div style={{ display: "flex", fontSize: 28, color: MIST, marginTop: 44 }}>This is to certify that</div>
              <div style={{ display: "flex", fontSize: 108, fontWeight: 800, marginTop: 18, textAlign: "center" }}>{name}</div>
              <div style={{ display: "flex", width: 220, height: 3, background: ORANGE, marginTop: 28 }} />
              <div style={{ display: "flex", fontSize: 28, color: MIST, marginTop: 34 }}>has successfully completed the</div>
              <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: ORANGE, marginTop: 10 }}>{distance.name.toUpperCase()}</div>
              <div style={{ display: "flex", fontSize: 30, letterSpacing: 4, marginTop: 6 }}>{UPCOMING_EVENT.name}</div>
            </div>

            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", borderTop: "1px solid #2a2a2f", paddingTop: 30 }}>
              {stats.map(([k, v]) => (
                <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: MIST }}>{k}</div>
                  <div style={{ display: "flex", fontSize: 44, fontWeight: 700, marginTop: 8 }}>{v}</div>
                </div>
              ))}
            </div>
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
