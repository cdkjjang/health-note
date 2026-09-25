// 가이드마다 대표 이미지 — 빌드 시 정적 생성.
//
// 예전에는 모든 가이드가 사이트 공용 이미지 하나를 썼다. 공유 카드도, 검색·디스커버의
// 큰 이미지 후보도 글마다 같아서 "이 글"을 보여 주지 못했다. 노트의 색·아이콘과
// 글 제목으로 글마다 다른 이미지를 만든다. 허브(lifebanjang-hub)와 같은 그림체다.
import { ImageResponse } from "next/og";
import { getGuide, guides } from "@/lib/guides";
import { NOTE_SLUG, noteLook } from "@/lib/note-look";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} 가이드 대표 이미지`;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

async function loadKoreanFont(text: string): Promise<ArrayBuffer> {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`,
    )
  ).text();
  const match = css.match(/src:\s*url\((.+?)\)\s*format\('(?:truetype|opentype|woff)'\)/);
  if (!match) throw new Error("OG 이미지용 폰트 URL을 찾지 못했습니다");
  return await (await fetch(match[1])).arrayBuffer();
}

function Icon({ paths, color, px, width = 1.7 }: { paths: string[]; color: string; px: number; width?: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const title = guide?.title ?? `${SITE_NAME} 가이드`;
  const sep = title.indexOf(" — ");
  const head = sep < 0 ? title : title.slice(0, sep);
  const tail = sep < 0 ? "" : title.slice(sep + 3);
  const look = noteLook(NOTE_SLUG);
  const brand = "생활반장 노트 시리즈";

  const font = await loadKoreanFont(head + tail + SITE_NAME + brand);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: look.color,
          fontFamily: "NotoSansKR",
          color: "#ffffff",
          padding: "64px 72px",
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{ position: "absolute", left: 0, right: 0, top: 70 + i * 64, height: 2, backgroundColor: "rgba(255,255,255,0.08)" }}
          />
        ))}
        <div style={{ position: "absolute", right: 40, bottom: -30, display: "flex", opacity: 0.16 }}>
          <Icon paths={look.paths} color="#ffffff" px={420} width={1.3} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 28, opacity: 0.85 }}>{brand}</div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
            <div style={{ fontSize: head.length > 18 ? 60 : 70, lineHeight: 1.22, letterSpacing: -2 }}>{head}</div>
            {tail && <div style={{ marginTop: 20, fontSize: 34, lineHeight: 1.35, opacity: 0.88 }}>{tail}</div>}
          </div>

          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#ffffff",
                color: look.color,
                borderRadius: 14,
                padding: "10px 18px 10px 12px",
                fontSize: 26,
              }}
            >
              <Icon paths={look.paths} color={look.color} px={30} width={2} />
              {SITE_NAME}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansKR", data: font, weight: 700, style: "normal" }],
    },
  );
}
