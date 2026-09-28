import { ImageResponse } from "next/og";
import { LOGO_COLORS, logoSvg } from "@/lib/logo";
import { theme } from "@/lib/theme";

// iOS home-screen icon (and Safari's fallback favicon). iOS fills transparency
// with black, so the logo sits on the light page background.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${Buffer.from(logoSvg(LOGO_COLORS)).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          background: theme.background,
        }}
      >
        <img src={src} width={160} height={155} alt="" />
      </div>
    ),
    size,
  );
}
