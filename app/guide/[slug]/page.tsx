import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/guides";
import type { Guide } from "@/lib/guides";
import { NOTE_SLUG, noteLook } from "@/lib/note-look";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import AdSlot from "@/components/AdSlot";
import GuideBanner from "@/components/GuideBanner";
import HubGuideLink from "@/components/HubGuideLink";

// 가이드 본문의 **강조**를 형광펜 강조로 바꾼다.
// 데이터 파일에서 마크다운 문법으로 강조를 표시해 왔는데 템플릿이 이를 변환하지
// 않아, 본문에 별표가 그대로 노출되고 있었다. 데이터는 사람이 쓴 것이므로
// HTML 특수문자를 먼저 이스케이프한 뒤 강조만 태그로 바꾼다.
// 2026-09-25: 굵게만 하던 것을 형광펜(.mark, globals.css)으로 바꿨다. 허브와 같은 표기.
function bold(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, '<strong class="mark">$1</strong>');
}

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

// 같은 폴더의 opengraph-image.tsx가 만드는 글별 대표 이미지.
const coverPath = (slug: string) => `/guide/${slug}/opengraph-image`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    // 루트 layout의 `%s | 노트명` 템플릿을 적용하지 않는다.
    // 구글 제목 링크는 한글 약 38자에서 잘리는데 접미사가 7자를 먹어,
    // 정작 본문 제목의 뒷부분(부제)이 밀려 나갔다. 사이트명은 검색결과에
    // 도메인 기준으로 따로 표시되므로 제목에서는 뺀다.
    title: { absolute: guide.title },
    description: guide.description,
    alternates: { canonical: `/guide/${guide.slug}` },
    // og:image는 opengraph-image.tsx가 글마다 채운다. 예전처럼 여기서
    // "/opengraph-image"를 지정하면 모든 글이 사이트 공용 이미지로 덮인다.
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
    },
  };
}

// 본문 글자 수로 읽는 시간을 어림한다. 한국어 정독 기준 분당 약 500자.
function readingMinutes(g: Guide): number {
  const text = [
    ...g.intro,
    ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]),
    ...g.faq.flatMap((f) => [f.q, f.a]),
  ].join("");
  return Math.max(1, Math.round(text.replace(/\s|\*/g, "").length / 500));
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => g !== undefined);
  // 노트마다 cta 필드가 없는 곳도 있어(경조사노트) 좁혀서 읽는다.
  const cta = (guide as { cta?: { href: string; label: string } }).cta;
  const minutes = readingMinutes(guide);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        image: `${SITE_URL}${coverPath(guide.slug)}`,
        datePublished: guide.updated,
        dateModified: guide.updated,
        inLanguage: "ko",
        mainEntityOfPage: `${SITE_URL}/guide/${guide.slug}`,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      // 검색결과에 "사이트명 > 가이드 > 글 제목" 경로가 표시되도록 한다.
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "가이드", item: `${SITE_URL}/guide` },
          { "@type": "ListItem", position: 3, name: guide.title },
        ],
      },
      ...(guide.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: guide.faq.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            },
          ]
        : []),
    ],
  };

  // --tone: 이 노트의 색(점·테두리 같은 장식용). 글자에는 사이트 accent를 쓴다
  // (accent는 다크 모드 대비까지 맞춰 둔 값이다).
  const toneStyle = { "--tone": noteLook(NOTE_SLUG).color } as CSSProperties;

  return (
    <article style={toneStyle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="현재 위치" className="mb-3 text-sm text-muted">
        <Link href="/guide" className="hover:text-accent">
          가이드
        </Link>
      </nav>
      <h1 className="text-[1.7rem] font-extrabold leading-snug tracking-tight">{guide.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {guide.updated} 고침 · 읽는 데 약 {minutes}분
      </p>

      {/* 머리 그림. 제목이 든 대표 이미지(opengraph-image)는 공유·검색용으로만 쓰고,
          본문에는 같은 말이 두 번 보이지 않게 글자 없는 그림을 둔다. */}
      <GuideBanner slug={guide.slug} note={NOTE_SLUG} sections={guide.sections.length} />

      <div className="mt-6 space-y-4 text-[16px] leading-[1.85]">
        {guide.intro.map((p) => (
          <p key={p.slice(0, 20)} dangerouslySetInnerHTML={{ __html: bold(p) }} />
        ))}
      </div>

      {guide.sections.map((section, i) => (
        <section key={section.heading} className="mt-12">
          <p className="text-sm font-extrabold tabular-nums text-accent">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h2 className="mt-0.5 text-[1.3rem] font-extrabold leading-snug tracking-tight">
            {section.heading}
          </h2>
          <div className="mt-3 space-y-4 text-[16px] leading-[1.85]">
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} dangerouslySetInnerHTML={{ __html: bold(p) }} />
            ))}
            {section.list && (
              <ul className="list-disc space-y-2 pl-5 marker:text-[var(--tone)]">
                {section.list.map((item) => (
                  <li key={item.slice(0, 20)} dangerouslySetInnerHTML={{ __html: bold(item) }} />
                ))}
              </ul>
            )}
          </div>
          {/* 본문 중간 광고 — 두 번째 섹션 뒤 한 곳만 */}
          {i === 1 && <AdSlot slot="guide-in-article" />}
        </section>
      ))}

      {guide.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[1.3rem] font-extrabold leading-snug tracking-tight">자주 묻는 질문</h2>
          <dl className="mt-4 divide-y divide-border-soft border-y border-border-soft">
            {guide.faq.map(({ q, a }) => (
              <div key={q} className="py-4">
                <dt className="font-bold">{q}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {cta && (
        <div className="mt-10 rounded-xl border border-border-soft bg-card p-5">
          <p className="font-bold">내 상황에 바로 적용해 보세요</p>
          <Link
            href={cta.href}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-bold text-white transition-colors hover:bg-accent-strong"
          >
            {cta.label} →
          </Link>
        </div>
      )}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-bold">함께 보면 좋은 글</h2>
          <ul className="space-y-2">
            {related.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guide/${g.slug}`}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {g.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <HubGuideLink />
    </article>
  );
}
