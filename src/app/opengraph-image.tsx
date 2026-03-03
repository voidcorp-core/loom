import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Loom — AI agents, scaffolded in seconds";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0A0F14",
          color: "#E6EDF3",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 16,
            backgroundColor: "#00F5A0",
            color: "#0A0F14",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          L
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Loom
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#9DA7B2",
          }}
        >
          AI agents, scaffolded in seconds
        </div>

        {/* Terminal */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 32,
            padding: "12px 24px",
            borderRadius: 12,
            backgroundColor: "#12181F",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 20,
          }}
        >
          <span style={{ color: "#00F5A0", marginRight: 8 }}>$</span>
          <span>npx @folpe/loom init</span>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            fontSize: 16,
            color: "#9DA7B2",
            marginTop: 48,
          }}
        >
          Free & Open Source — MIT License
        </div>
      </div>
    ),
    { ...size }
  );
}
