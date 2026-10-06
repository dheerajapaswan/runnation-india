import { ImageResponse } from "next/og";
import { HttpError, handle, requireSession } from "@/server/http";
import { db } from "@/lib/db";
import { getDistance } from "@/data/distances";
import { UPCOMING_EVENT } from "@/data/event";
import { DISTANCE_FROM_DB } from "@/server/mappers";

const W = 1600;
const H = 1000;
const ORANGE = "#ff5a1f";
const BONE = "#f3f0e9";
const MIST = "#9a9aa3";

/** Digital E-BIB (PNG). Issued to the signed-in participant once their payment is confirmed. */
export async function GET() {
  return handle(async () => {
    const id = await requireSession("participant");
    const reg = await db.registration.findUnique({ where: { id } });
    if (!reg) throw new HttpError(404, "Registration not found");
    if (reg.paymentStatus !== "PAID") throw new HttpError(403, "Your E-BIB is available once your payment is confirmed.");

    const distance = getDistance(DISTANCE_FROM_DB[reg.distance]);
    const name = reg.fullName.toUpperCase().slice(0, 28);
    const pin = (side: "left" | "right") => (
      <div style={{ display: "flex", position: "absolute", top: 56, [side]: 60, width: 34, height: 34, borderRadius: 17, background: "#08080a", border: "2px solid #3a3a42" }} />
    );

    const png = new ImageResponse(
      (
        <div style={{ width: W, height: H, display: "flex", background: "#08080a", padding: 28 }}>
          <div
            style={{
              position: "relative",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: BONE,
              color: "#0a0a0c",
              padding: "70px 90px 54px",
            }}
          >
            {pin("left")}
            {pin("right")}

            <div style={{ display: "flex", justifyContent: "center", fontSize: 40, fontWeight: 800, letterSpacing: 12 }}>
              RUNNATION<span style={{ color: ORANGE, marginLeft: 16 }}>INDIA</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "flex", fontSize: 340, fontWeight: 800, lineHeight: 1, letterSpacing: -6 }}>{reg.bibNumber}</div>
              <div style={{ display: "flex", fontSize: 76, fontWeight: 800, marginTop: 8, letterSpacing: 4 }}>{name}</div>
            </div>

            <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", background: "#0a0a0c", color: BONE, padding: "26px 44px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 18, letterSpacing: 6, color: MIST }}>DISTANCE</div>
                <div style={{ display: "flex", fontSize: 56, fontWeight: 800, color: ORANGE }}>{distance.name.toUpperCase()}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", fontSize: 18, letterSpacing: 6, color: MIST }}>EVENT</div>
                <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>{UPCOMING_EVENT.name}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ display: "flex", fontSize: 18, letterSpacing: 6, color: MIST }}>REGISTRATION ID</div>
                <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>{reg.code}</div>
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
