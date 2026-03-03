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
          background: "#0A0F14",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,245,160,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#00F5A0",
              color: "#0A0F14",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            L
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#E6EDF3",
              letterSpacing: "-0.02em",
            }}
          >
            Loom
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              color: "#9DA7B2",
              maxWidth: 600,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            AI agents,{" "}
            <span style={{ color: "#00F5A0" }}>
              scaffolded in seconds
            </span>
          </div>

          {/* Terminal snippet */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 16,
              padding: "12px 24px",
              borderRadius: 12,
              background: "#12181F",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 18,
              fontFamily: "monospace",
            }}
          >
            <span style={{ color: "#00F5A0" }}>$</span>
            <span style={{ color: "#E6EDF3" }}>npx @folpe/loom init</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 16,
            color: "#9DA7B2",
          }}
        >
          Free & Open Source
          <span style={{ color: "#00F5A0" }}>•</span>
          MIT License
        </div>
      </div>
    ),
    { ...size }
  );
}
