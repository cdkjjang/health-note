import type { Metadata } from "next";
import Link from "next/link";
import CopayRateCalculator from "@/components/CopayRateCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "병원비 본인부담률 계산기 — 같은 진료, 두 배 차이",
  description:
    "외래 본인부담률은 의원 30%, 병원 40%, 종합병원 50%, 상급종합병원 60%입니다. 입원 20%, 산정특례 5~10%까지 반영해 실제로 내는 돈을 계산합니다.",
  alternates: { canonical: "/calc/rate" },
};

const faq = [
  {
    q: "같은 감기인데 왜 대학병원이 더 비싼가요?",
    a: "외래 본인부담률이 의료기관 종별로 다르기 때문입니다. 의원 30%, 병원 40%, 종합병원 50%, 상급종합병원 60%입니다. 상급종합병원은 중증 환자를 보라고 만든 곳이라, 경증으로 가면 부담을 크게 지웁니다. 진료비 자체도 상급기관이 높은 편이라 실제 차이는 두 배를 넘습니다.",
  },
  {
    q: "입원은 어디서 해도 같나요?",
    a: "본인부담률은 종별과 무관하게 20%로 같습니다. 다만 진료비 총액과 상급병실료 등 비급여가 다르므로 실제 금액은 크게 차이납니다. 입원 식대는 50%를 부담합니다.",
  },
  {
    q: "비급여가 뭔가요?",
    a: "건강보험이 적용되지 않아 전액 본인이 부담하는 항목입니다. 상급병실료 차액, 도수치료, 미용·성형, 일부 신의료기술 등이 해당합니다. 본인부담률과 무관하고, 본인부담상한제로도 돌려받지 못합니다. 병원비가 예상보다 많이 나오는 경우는 대개 여기서 갈립니다.",
  },
  {
    q: "산정특례는 어떻게 등록하나요?",
    a: "의사가 발급한 건강보험 산정특례 등록 신청서를 공단에 제출합니다. 병원에서 대행해 주는 경우가 많습니다. 암은 등록일부터 5년간 5%, 희귀·중증난치질환은 10%가 적용됩니다. 해당 질환 관련 진료에만 적용되고, 감기 등 다른 진료에는 적용되지 않습니다.",
  },
  {
    q: "의원 진료 후 약국에서도 돈을 내는데요?",
    a: "약국 조제도 별도로 본인부담률 30%가 적용됩니다. 병원 진료비와 약값은 각각 계산됩니다. 그래서 진료비가 5천원이어도 약값이 더 나오는 경우가 있습니다.",
  },
];

export default function RatePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "병원비 본인부담률 계산기" },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-2 text-2xl font-extrabold">병원비 본인부담률 계산기</h1>
      <p className="mb-6 text-muted">
        같은 진료도 어디서 받느냐로 내는 돈이 달라집니다. 종별 부담률과 산정특례,
        비급여까지 반영해 계산합니다.
      </p>

      <CopayRateCalculator />

      <AdSlot slot="rate-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">
          외래는 어디서 받느냐로 두 배까지 갈립니다
        </h2>
        <p>
          건강보험이 적용되는 진료라도 본인이 내는 비율은 의료기관 종별로 정해져
          있습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-border-soft text-left">
                <th className="py-2 pr-3 font-bold">구분</th>
                <th className="py-2 pr-3 font-bold">본인부담률</th>
                <th className="py-2 font-bold">10만원 진료 시</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">의원</td><td className="py-2 pr-3">30%</td><td className="py-2">3만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">병원</td><td className="py-2 pr-3">40%</td><td className="py-2">4만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">종합병원</td><td className="py-2 pr-3">50%</td><td className="py-2">5만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">상급종합병원</td><td className="py-2 pr-3">60%</td><td className="py-2">6만원</td></tr>
              <tr><td className="py-2 pr-3">입원 (종별 무관)</td><td className="py-2 pr-3">20%</td><td className="py-2">2만원</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          <strong>상급종합병원은 의원의 두 배입니다.</strong> 대학병원은 중증 환자와
          희귀질환을 보라고 만든 곳이라, 경증 진료에는 의도적으로 부담을 크게
          지웁니다. 게다가 진료비 자체도 상급기관이 높아 실제 차이는 두 배를
          넘습니다.
        </p>
        <p>
          감기나 가벼운 증상이라면 동네 의원이 훨씬 싸고 빠릅니다. 필요하면 의원에서
          진료의뢰서를 받아 상급기관으로 가는 것이 원래의 순서입니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          진짜 변수는 비급여입니다
        </h2>
        <p>
          영수증을 보면 <strong>급여</strong>와 <strong>비급여</strong>가 나뉘어
          있습니다. 본인부담률은 급여 항목에만 적용됩니다.
        </p>
        <p>
          비급여는 건강보험이 적용되지 않아 <strong>전액 본인 부담</strong>입니다.
          상급병실료 차액, 도수치료, 체외충격파, 미용·성형, 일부 신의료기술과
          신약이 여기 해당합니다.
        </p>
        <p>
          그래서 &ldquo;30%만 내면 되는 줄 알았는데 왜 이렇게 많이 나왔나&rdquo; 하는
          경우는 대부분 비급여 비중이 큰 것입니다. 게다가{" "}
          <strong>비급여는 본인부담상한제로도 돌려받지 못합니다.</strong> 아무리 많이
          내도 환급 계산에 들어가지 않습니다.
        </p>
        <p>
          진료 전에 &ldquo;이건 급여인가요 비급여인가요&rdquo;를 물어보는 것만으로
          예상 밖의 청구를 상당히 줄일 수 있습니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          산정특례 — 중증질환은 5~10%
        </h2>
        <p>
          암, 중증화상, 희귀·중증난치질환 등은 등록하면 본인부담률이 크게 내려갑니다.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li><strong>암</strong> — 등록일부터 5년간 5%</li>
          <li><strong>희귀·중증난치질환</strong> — 10%</li>
          <li><strong>중증화상</strong> — 등록일부터 1년간 5%</li>
          <li><strong>심장·뇌혈관질환</strong> — 해당 수술·시술일부터 30일간 5%</li>
        </ul>
        <p>
          산정특례는 <strong>종별 부담률을 덮어씁니다.</strong> 상급종합병원에서
          받아도 5%만 냅니다. 다만 등록해야 적용되고, 해당 질환 관련 진료에만
          적용됩니다. 같은 병원에서 감기로 진료받으면 일반 부담률입니다.
        </p>
        <p>
          그리고 여기서도 <strong>비급여는 줄지 않습니다.</strong> 암 환자의 병원비
          부담이 여전히 큰 이유가 이것입니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">자주 묻는 질문</h2>
        <dl className="space-y-4">
          {faq.map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-border-soft bg-card p-4 shadow-sm">
              <dt className="font-bold"><span className="text-accent">Q.</span> {q}</dt>
              <dd className="mt-2 text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CalcNotes
        updated="2026-08-20"
        basis={[
          {
            law: "국민건강보험법 제44조 (비용의 일부부담)",
            detail:
              "요양급여를 받는 자는 대통령령으로 정하는 바에 따라 비용의 일부를 본인이 부담합니다.",
          },
          {
            law: "같은 법 시행령 별표2 (본인일부부담금의 부담률 및 부담액)",
            detail:
              "외래는 의원 30%, 병원 40%, 종합병원 50%, 상급종합병원 60%, 약국 30%입니다. 입원은 요양기관 종별과 관계없이 20%이며, 입원 식대는 50%를 부담합니다.",
          },
          {
            law: "본인일부부담금 산정특례",
            detail:
              "암은 등록일부터 5년간 5%, 희귀·중증난치질환은 10%, 중증화상은 등록일부터 1년간 5%, 심장·뇌혈관질환은 해당 수술·시술일부터 30일간 5%가 적용됩니다. 등록한 질환의 진료에만 적용됩니다.",
          },
          {
            law: "비급여",
            detail:
              "건강보험이 적용되지 않는 항목은 본인부담률과 무관하게 전액 본인이 부담하며, 본인부담상한제 대상에서도 제외됩니다.",
          },
        ]}
        note="의원급 65세 이상 정률·정액 경감, 임신부·아동 외래 경감, 의료급여 수급자, 연간 외래 365회 초과 시 본인부담률 상향, 상급병실료와 선택진료비는 반영하지 않았습니다. 참고용 추정치이며 실제 청구는 의료기관의 산정과 심사평가원 심사에 따릅니다."
        examples={[
          {
            title: "급여 10만원 진료 · 의원 외래",
            steps: [
              "본인부담률 30%",
              "본인 3만원 · 공단 7만원",
            ],
            result: "3만원",
          },
          {
            title: "같은 진료를 상급종합병원에서",
            steps: [
              "본인부담률 60%",
              "본인 6만원 · 공단 4만원",
            ],
            result: "6만원 — 의원의 두 배",
          },
          {
            title: "급여 10만원 + 비급여 90만원 · 의원 외래",
            steps: [
              "급여 본인부담 = 10만원 × 30% = 3만원",
              "비급여 90만원은 전액 본인 부담",
              "총 93만원",
            ],
            result: "명목 30%인데 실질 부담률은 93%",
          },
          {
            title: "암 산정특례 · 급여 1,000만원 · 상급종합병원 입원",
            steps: [
              "산정특례 5%가 종별·입원 부담률을 덮어씀",
              "본인 50만원 · 공단 950만원",
            ],
            result: "50만원 (비급여는 별도)",
          },
        ]}
        pitfalls={[
          {
            heading: "진료비 총액을 넣어야 합니다",
            body:
              "본인이 낸 금액이 아니라 공단 부담분까지 포함한 급여 총액을 넣어야 계산이 맞습니다. 영수증의 '급여' 칸 합계를 보세요.",
          },
          {
            heading: "약값은 따로 계산됩니다",
            body:
              "병원 진료와 약국 조제는 각각 본인부담률이 적용됩니다. 약국도 30%입니다. 진료비가 적어도 약값이 더 나오는 경우가 있습니다.",
          },
          {
            heading: "산정특례는 등록해야 적용됩니다",
            body:
              "진단만으로 자동 적용되지 않습니다. 의사가 발급한 신청서를 공단에 내야 하고, 등록일부터 적용됩니다. 병원이 대행해 주는 경우가 많으니 확인하세요.",
          },
          {
            heading: "의뢰서 없이 상급종합병원에 가면 전액 부담일 수 있습니다",
            body:
              "상급종합병원 외래는 원칙적으로 요양급여의뢰서(진료의뢰서)가 있어야 건강보험이 적용됩니다. 없으면 급여가 인정되지 않아 전액을 부담하는 경우가 있습니다. 응급 등 예외는 있습니다.",
          },
        ]}
        sources={[
          { label: "건강보험심사평가원", href: "https://www.hira.or.kr" },
          { label: "국민건강보험공단 1577-1000", href: "https://www.nhis.or.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
          { label: "본인부담상한제 계산기", href: "/calc/cap" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li><Link href="/calc/cap" className="text-accent underline-offset-4 hover:underline">본인부담상한제 환급 계산기 →</Link></li>
          <li><Link href="/calc/checkup" className="text-accent underline-offset-4 hover:underline">건강검진 대상 조회 →</Link></li>
          <li><Link href="/guide/covered-vs-not" className="text-accent underline-offset-4 hover:underline">급여와 비급여, 영수증 읽는 법 →</Link></li>
        </ul>
      </section>
    </div>
  );
}
