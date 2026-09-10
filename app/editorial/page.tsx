import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME } from "@/lib/site";
import { EDITORIAL, EDITORIAL_UPDATED } from "@/lib/editorial";

const CONTACT_EMAIL = "cdkjjang@gmail.com";

// 본문은 `lib/editorial.ts`에 있다. 노트마다 내용이 다르므로 이 파일만 공용이다.
// 2026-09-10 이전에는 19개 사이트가 같은 문장을 그대로 쓰고 있었다.

/**
 * 본문의 **강조**를 <strong>으로 바꾼다.
 *
 * ⚠️ 가이드 템플릿의 bold()와 달리 **dangerouslySetInnerHTML을 쓰지 않는다.**
 *    React 노드로 쪼개므로 데이터에 태그가 섞여도 그대로 글자로 나간다.
 *    이 변환이 없으면 별표가 화면에 노출된다(2026-08-19에 전 노트에서 겪은 일).
 */
function emphasize(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  );
}

export const metadata: Metadata = {
  title: "편집 원칙과 근거 자료",
  description: EDITORIAL.metaDescription,
  alternates: { canonical: "/editorial" },
};

export default function EditorialPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">편집 원칙과 근거 자료</h1>
      <p className="text-sm text-muted">최종 수정: {EDITORIAL_UPDATED}</p>

      {EDITORIAL.lead.map((text, i) => (
        <p key={`lead-${i}`} className="text-muted">
          {emphasize(text)}
        </p>
      ))}

      {EDITORIAL.sections.map((section, i) => (
        <section key={`s-${i}`} className="space-y-3">
          <h2 className="text-lg font-bold">
            {i + 1}. {section.heading}
          </h2>
          {section.paragraphs?.map((text, j) => (
            <p key={`s-${i}-p-${j}`}>{emphasize(text)}</p>
          ))}
          {section.list && (
            <ul className="list-disc space-y-2 pl-5">
              {section.list.map((text, j) => (
                <li key={`s-${i}-l-${j}`}>{emphasize(text)}</li>
              ))}
            </ul>
          )}
          {section.sources && (
            <ul className="list-disc space-y-2 pl-5">
              {section.sources.map((src) => (
                <li key={src.href}>
                  <a
                    href={src.href}
                    rel="noopener nofollow"
                    target="_blank"
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {src.label}
                  </a>{" "}
                  — {emphasize(src.note)}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">{EDITORIAL.sections.length + 1}. 정정 요청과 운영</h2>
        <p>{emphasize(EDITORIAL.correction)}</p>
        <p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="text-muted">
          {SITE_NAME}는 생활반장(lifebanjang.com) 노트 시리즈의 하나로, 개인이 직접 만들고
          운영합니다. 운영 비용은 페이지에 게재되는 광고로 충당하며, 광고 여부가 계산 결과나
          글의 내용에 영향을 주지 않습니다.
        </p>
      </section>
    </div>
  );
}
