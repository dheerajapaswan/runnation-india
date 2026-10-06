import { ImageResponse } from "next/og";

export const alt = "RunNation India | Run anywhere. Finish with glory.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 80% 20%, #4a1d0b 0%, #08080a 55%)",
          color: "#f3f0e9",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 8, fontWeight: 700 }}>
          RUNNATION<span style={{ color: "#ff5a1f", marginLeft: 12 }}>INDIA</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, fontWeight: 800, lineHeight: 1 }}>
          <span>RUN ANYWHERE.</span>
          <span style={{ color: "#ff5a1f" }}>FINISH WITH GLORY.</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9a9aa3" }}>
          3K · 5K · 10K · 21.1K Half Marathon · Virtual Running Events
        </div>
      </div>
    ),
    size,
  );
}
