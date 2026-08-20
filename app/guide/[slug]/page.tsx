import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import AdSlot from "@/components/AdSlot";
import HubGuideLink from "@/components/HubGuideLink";

// 가이드 본문의 **강조**를 <strong>으로 바꾼다.
// 데이터 파일에서 마크다운 문법으로 강조를 표시해 왔는데 템플릿이 이를 변환하지
// 않아, 본문에 별표가 그대로 노출되고 있었다. 데이터는 사람이 쓴 것이므로
// HTML 특수문자를 먼저 이스케이프한 뒤 강조만 태그로 바꾼다.
function bold(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guide/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const related = guide.related
    .map((s) => getGuide(s))
    .filter((g) => g !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
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

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-2xl font-extrabold leading-snug">{guide.title}</h1>
      <p className="mt-2 text-sm text-muted">마지막 업데이트: {guide.updated}</p>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
        {guide.intro.map((p) => (
          <p
              key={p.slice(0, 20)}
              dangerouslySetInnerHTML={{ __html: bold(p) }}
            />
        ))}
      </div>

      {guide.sections.map((section, i) => (
        <section key={section.heading} className="mt-10">
          <h2 className="border-l-4 border-accent pl-3 text-xl font-bold leading-snug">
            {section.heading}
          </h2>
          <div className="mt-3 space-y-4 text-[15px] leading-relaxed">
            {section.paragraphs.map((p) => (
              <p
              key={p.slice(0, 20)}
              dangerouslySetInnerHTML={{ __html: bold(p) }}
            />
            ))}
            {section.list && (
              <ul className="list-disc space-y-2 pl-5">
                {section.list.map((item) => (
                  <li
                    key={item.slice(0, 20)}
                    dangerouslySetInnerHTML={{ __html: bold(item) }}
                  />
                ))}
              </ul>
            )}
          </div>
          {i === 1 && <AdSlot slot="guide-in-article" />}
        </section>
      ))}

      {guide.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="border-l-4 border-accent pl-3 text-xl font-bold leading-snug">
            자주 묻는 질문
          </h2>
          <dl className="mt-4 space-y-4">
            {guide.faq.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl border border-border-soft bg-card p-4 shadow-sm"
              >
                <dt className="font-bold">
                  <span className="text-accent">Q.</span> {q}
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {guide.cta && (
        <div className="mt-10 rounded-2xl border-2 border-accent bg-card p-5 text-center">
          <p className="font-bold">내 상황에 바로 적용해 보세요</p>
          <Link
            href={guide.cta.href}
            className="mt-3 inline-block rounded-xl bg-accent px-6 py-2.5 font-bold text-white transition-colors hover:bg-accent-strong"
          >
            {guide.cta.label} →
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
