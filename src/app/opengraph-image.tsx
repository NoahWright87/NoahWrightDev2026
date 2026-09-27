import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { darkTheme } from "@/lib/theme";

// Link-preview card for LinkedIn, Slack, etc. Rendered once at build time.
// Uses the original JPEG portrait: the OG renderer can't decode WebP.

export const alt = "Noah Wright: engineering leader, builder of useful software, Air Force veteran";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/noah/noah-original.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 88px",
          background: darkTheme.background,
          color: darkTheme.foreground,
          borderBottom: `16px solid ${darkTheme.primary}`,
        }}
      >
        <img
          src={photoSrc}
          width={340}
          height={340}
          alt=""
          style={{ borderRadius: 40, objectFit: "cover", border: `6px solid ${darkTheme.secondary}` }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1 }}>Noah Wright</div>
          <div style={{ fontSize: 40, color: darkTheme.primary }}>Engineering leader · Builder · Veteran</div>
          <div style={{ fontSize: 32, opacity: 0.8 }}>noahwright.dev</div>
        </div>
      </div>
    ),
    size,
  );
}
