import { ImageResponse } from "next/og";
import { domain } from "@/lib/domain";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt") || "Generated with HyperSpeed";
  const title = prompt.length > 100 ? `${prompt.slice(0, 97)}...` : prompt;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage: `url(${domain}/dynamic-og.png)`,
          backgroundSize: "1200px 630px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          padding: "70px 140px",
        }}
      >
        <div
          style={{
            maxWidth: "860px",
            fontSize: 54,
            lineHeight: 1.08,
            color: "#0A0D12",
            textAlign: "center",
            fontWeight: 800,
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
