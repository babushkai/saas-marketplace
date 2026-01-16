import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SaaSマーケット - 日本のSaaS・サービスを見つけよう";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #0D9488 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            padding: "60px 80px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
              }}
            >
              <span style={{ fontSize: "40px", color: "white" }}>S</span>
            </div>
            <span
              style={{
                fontSize: "48px",
                fontWeight: 700,
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              SaaSマーケット
            </span>
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#374151",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            日本のSaaS・サービスを見つけよう
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                background: "#F3F4F6",
                padding: "12px 24px",
                borderRadius: "9999px",
                fontSize: "20px",
                color: "#4F46E5",
              }}
            >
              500+ SaaSツール
            </div>
            <div
              style={{
                background: "#F3F4F6",
                padding: "12px 24px",
                borderRadius: "9999px",
                fontSize: "20px",
                color: "#0D9488",
              }}
            >
              無料で比較
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
