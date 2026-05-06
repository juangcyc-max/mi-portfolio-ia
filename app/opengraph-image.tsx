import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mindbridge IA - Desarrollo Web + Inteligencia Artificial";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Green radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 700,
            height: 700,
            marginTop: -350,
            marginLeft: -350,
            background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top-left accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #10b981, #06b6d4, #10b981)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "rgba(255,255,255,0.06)",
            border: "1.5px solid rgba(16,185,129,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            boxShadow: "0 0 40px rgba(16,185,129,0.3)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://mindbride.net/logo.png"
            width={64}
            height={64}
            alt="Mindbridge IA"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: "white",
            marginBottom: 16,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          Mindbridge IA
        </div>

        {/* Divider */}
        <div
          style={{
            width: 60,
            height: 3,
            background: "linear-gradient(90deg, #10b981, #06b6d4)",
            borderRadius: 2,
            marginBottom: 24,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "#94a3b8",
            marginBottom: 44,
            textAlign: "center",
            maxWidth: 680,
            lineHeight: 1.4,
          }}
        >
          Desarrollo Web profesional + Automatizaciones con IA para empresas
        </div>

        {/* Pill tags */}
        <div style={{ display: "flex", gap: 14 }}>
          {["Web Profesional", "IA Integrada", "Automatización"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 22px",
                background: "rgba(16,185,129,0.12)",
                border: "1.5px solid rgba(16,185,129,0.35)",
                borderRadius: 100,
                fontSize: 18,
                color: "#10b981",
                fontWeight: 700,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain footer */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            fontSize: 20,
            color: "#475569",
            letterSpacing: 1,
          }}
        >
          mindbride.net
        </div>
      </div>
    ),
    { ...size }
  );
}
