import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const alt = "Mindbridge IA - Desarrollo Web + Inteligencia Artificial";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoBuffer = fs.readFileSync(path.join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #10b981, #06b6d4)",
          }}
        />

        {/* Left green panel */}
        <div
          style={{
            width: 420,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.08) 100%)",
            borderRight: "1px solid rgba(16,185,129,0.2)",
            gap: 20,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={140}
            height={140}
            alt="Mindbridge IA"
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#10b981",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            mindbride.net
          </div>
        </div>

        {/* Right content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 70px",
            gap: 0,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#10b981",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Agencia Digital
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "white",
              lineHeight: 1,
              marginBottom: 20,
              letterSpacing: -2,
            }}
          >
            Mindbridge IA
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              lineHeight: 1.4,
              marginBottom: 48,
              maxWidth: 580,
            }}
          >
            Desarrollo Web profesional + IA integrada para empresas
          </div>

          {/* Pills */}
          <div style={{ display: "flex", gap: 12 }}>
            {["Web", "IA", "Automatización"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "12px 28px",
                  background: "rgba(16,185,129,0.15)",
                  border: "1.5px solid rgba(16,185,129,0.4)",
                  borderRadius: 100,
                  fontSize: 20,
                  color: "#10b981",
                  fontWeight: 700,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
