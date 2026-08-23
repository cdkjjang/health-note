import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import HomeNotes from "@/components/HomeNotes";
import { guides } from "@/lib/guides";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const TOOLS = [
  {
    href: "/calc/dependent",
    title: "피부양자 자격 판정",
    desc: "보험료 0원이 되는 조건. 소득·재산·사업자등록을 하나씩 확인",
    badge: "피부양자",
  },
  {
    href: "/calc/cap",
    title: "본인부담상한제 환급",
    desc: "한 해 병원비가 상한을 넘으면 돌려받습니다. 2026년 90만~843만원",
    badge: "환급",
  },
  {
    href: "/calc/checkup",
    title: "건강검진 대상 조회",
    desc: "출생연도 홀짝으로 갈리는 일반검진과 암 6종을 한 번에",
    badge: "건강검진",
  },
  {
    href: "/calc/rate",
    title: "병원비 본인부담률",
    desc: "의원 30%, 상급종합 60%. 같은 진료에 왜 두 배를 내는지",
    badge: "병원비",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-6 text-center sm:py-10">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          건강보험,
          <br className="sm:hidden" /> 어디서 돈이 갈리나
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          피부양자 자격이 되는지, 병원비를 얼마나 돌려받는지, 올해 어떤 검진
          대상인지, 같은 진료에 왜 다른 돈을 내는지 — 알면 달라지는 것들을
          한곳에 모았습니다.
        </p>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm transition-all hover:border-accent hover:shadow-md"
          >
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent-strong">
              {tool.badge}
            </span>
            <h2 className="mt-3 text-lg font-bold leading-snug">{tool.title}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{tool.desc}</p>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">건강보험 가이드</h2>
          <Link href="/guide" className="text-[15px] text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <ul className="space-y-3">
          {guides.slice(0, 10).map((g) => (
            <li key={g.slug}>
              <div className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent">
                {/* 제목만 링크로 둔다 — 설명까지 앵커에 넣으면 본문 대부분이
                    링크 텍스트가 된다. */}
                <p className="font-bold leading-snug">
                  <Link href={`/guide/${g.slug}`} className="hover:text-accent">
                    {g.title}
                  </Link>
                </p>
                <p className="mt-1 line-clamp-2 text-[15px] text-muted">{g.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <HomeNotes
        siteName={SITE_NAME}
        updated="2026-08-20"
        intro="건강보험은 전 국민이 들어 있지만, 정작 어디서 돈이 갈리는지는 잘 알려져 있지 않습니다. 아래 네 가지가 실제로 금액이 크게 달라지는 지점입니다."
        scenarios={[
          {
            situation: "퇴직·실직해서 보험료가 걱정될 때",
            action:
              "가장 먼저 볼 것은 피부양자 자격입니다. 되면 보험료가 0원이고, 부양하는 가족의 보험료도 늘지 않습니다. 다만 사업자등록이 있으면 사업소득 1원에도 탈락하고, 소득 2,000만원을 1원이라도 넘으면 즉시 자격을 잃습니다. 실업급여는 소득으로 보지 않습니다.",
            href: "/calc/dependent",
            label: "피부양자 자격 확인하기",
          },
          {
            situation: "한 해 병원비가 많이 나왔을 때",
            action:
              "소득분위별 상한액을 넘으면 초과분을 돌려받습니다. 2026년 기준 1분위 90만원부터 10분위 843만원까지입니다. 다만 비급여는 계산에 들어가지 않습니다. '500만원 냈는데 왜 환급이 없나'는 대부분 이 경우입니다.",
            href: "/calc/cap",
            label: "환급액 계산하기",
          },
          {
            situation: "건강검진 안내문을 받았을 때",
            action:
              "일반건강검진은 2년에 한 번이고 출생연도 홀짝으로 갈립니다. 암검진은 종류마다 나이와 주기가 달라 헷갈립니다. 자궁경부암은 만 20세부터인데 '검진은 중년부터'라는 생각에 가장 많이 놓칩니다.",
            href: "/calc/checkup",
            label: "올해 검진 대상 보기",
          },
          {
            situation: "병원비가 예상보다 많이 나왔을 때",
            action:
              "외래 본인부담률이 의원 30%, 상급종합병원 60%로 두 배 차이입니다. 그리고 비급여는 부담률과 무관하게 전액 본인 부담입니다. 영수증에서 급여와 비급여가 나뉜 칸을 먼저 보세요.",
            href: "/calc/rate",
            label: "본인부담률 계산하기",
          },
        ]}
        faq={[
          {
            q: "지역가입자 보험료는 왜 계산해 주지 않나요?",
            a: "재산을 60등급 점수표로 환산하는 방식인데 이 표와 점수당 금액이 매년 바뀝니다. 확인해 보니 출처마다 값이 달라, 어설프게 추정하면 오히려 잘못된 판단을 부릅니다. 정확한 금액은 국민건강보험공단 홈페이지의 지역보험료 모의계산으로 확인하세요. 이 사이트는 검증할 수 있는 기준만 계산에 넣습니다.",
          },
          {
            q: "비급여가 왜 그렇게 중요한가요?",
            a: "건강보험이 적용되지 않아 전액 본인이 부담하고, 본인부담상한제로도 돌려받지 못하기 때문입니다. 상급병실료 차액, 도수치료, 미용·성형, 일부 신의료기술이 여기 해당합니다. 명목 부담률이 30%여도 비급여가 크면 실제로는 90% 넘게 내는 일이 생깁니다.",
          },
          {
            q: "계산 결과가 공단에서 안내받은 금액과 다릅니다",
            a: "피부양자 부양요건은 동거 여부와 다른 부양자의 존재를 개별로 확인하고, 본인부담상한제의 소득분위도 공단이 산정합니다. 이 사이트는 공개된 기준을 코드로 옮긴 참고용이며, 확정 판단은 공단이 합니다.",
          },
          {
            q: "입력한 정보가 저장되나요?",
            a: "저장되지 않습니다. 모든 계산은 이용자의 브라우저 안에서 이루어지며 서버로 전송되지 않습니다. 회원가입도 없습니다.",
          },
        ]}
        maintained={[
          "피부양자 소득 요건 2,000만원 · 사업자등록 시 사업소득 0원",
          "피부양자 재산 요건 — 과세표준 5.4억 / 9억, 중간 구간 소득 1,000만원",
          "본인부담상한액 — 매년 1월 고시, 2026년 90만~843만원",
          "요양병원 120일 초과 상한액 — 2026년 143만~1,096만원",
          "외래 본인부담률 — 의원 30% / 병원 40% / 종합 50% / 상급종합 60%",
          "산정특례 — 암 5%, 희귀·중증난치 10%",
          "국가암검진 6종 — 위 40세·대장 50세·유방 40세·자궁경부 20세·간 40세·폐 54~74세",
        ]}
      />

      <AdSlot slot="home-bottom" />
    </div>
  );
}
