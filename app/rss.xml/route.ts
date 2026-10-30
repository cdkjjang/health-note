// 가이드 RSS — 네이버 서치어드바이저 'RSS 제출'용 (2026-10-30).
// 새 글·고친 글을 네이버가 빨리 가져가게 한다. 사이트맵은 전체 목록, RSS는 '무엇이 바뀌었나'.
// 최근 고친 순으로 정렬하고 pubDate는 가이드의 updated 날짜(KST 09:00)를 쓴다.
import { guides } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/\*\*/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rfc822(date: string): string {
  return new Date(`${date}T09:00:00+09:00`).toUTCString();
}

export function GET() {
  const items = [...guides].sort((a, b) => b.updated.localeCompare(a.updated));
  const latest = items[0]?.updated;
  const body = items
    .map((g) => {
      const url = `${SITE_URL}/guide/${g.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(g.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(g.description)}</description>`,
        `      <pubDate>${rfc822(g.updated)}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} 가이드</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_NAME)}의 가이드 글 — 최근 고친 순</description>
    <language>ko</language>
${latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` : ""}${body}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
