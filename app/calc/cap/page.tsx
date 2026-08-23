import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import Link from "next/link";
import CopayCapCalculator from "@/components/CopayCapCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "본인부담상한제 환급 계산기 — 병원비 돌려받기",
  description:
    "한 해 병원비가 소득분위별 상한액을 넘으면 초과분을 돌려받습니다. 2026년 상한액(90만~843만원)으로 환급액을 계산하고, 비급여가 왜 제외되는지 설명합니다.",
  alternates: { canonical: "/calc/cap" },
};

const faq = [
  {
    q: "병원비를 500만원이나 냈는데 왜 환급이 없나요?",
    a: "비급여 비중이 큰 경우입니다. 본인부담상한제는 건강보험이 적용된 급여 항목의 본인부담금만 계산합니다. 상급병실료 차액, 도수치료, 미용·성형, 일부 신의료기술은 비급여라 아무리 많이 내도 상한제와 무관합니다. 영수증에서 '급여'와 '비급여'가 나뉜 칸을 확인해 보세요.",
  },
  {
    q: "소득분위는 어떻게 정해지나요?",
    a: "연봉이나 재산이 아니라 그해에 낸 건강보험료의 연평균으로 1~10분위를 나눕니다. 직장가입자와 지역가입자를 같은 기준으로 봅니다. 공단이 산정하므로 본인이 예상한 구간과 다를 수 있습니다.",
  },
  {
    q: "언제 돌려받나요?",
    a: "전년도 진료분을 다음 해 8월 말 이후 순차적으로 정산해 안내문을 보냅니다. 신청서를 제출하면 계좌로 입금됩니다. 별도로 '사전급여'도 있는데, 같은 병원에서 상한액을 넘긴 경우 병원이 진료 중에 미리 정산해 주는 방식입니다.",
  },
  {
    q: "요양병원에 오래 입원하면 왜 상한액이 올라가나요?",
    a: "장기 입원을 통한 과다 이용을 억제하려는 장치입니다. 요양병원에 120일을 넘겨 입원하면 더 높은 상한액이 적용됩니다. 1분위 기준 90만원이 143만원이 되고, 10분위는 843만원이 1,096만원이 됩니다.",
  },
  {
    q: "실손보험금을 받았으면 환급이 줄어드나요?",
    a: "상한제 환급 계산 자체는 영향을 받지 않습니다. 다만 실손보험에서 이미 보상받은 부분에 대해 공단 환급까지 받으면 이중 보상이 되므로, 보험사가 환급금을 반영해 정산을 요구할 수 있습니다. 보험 약관을 확인하세요.",
  },
];

export default function CapPage() {
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
          { "@type": "ListItem", position: 2, name: "본인부담상한제 계산기" },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-2 text-2xl font-extrabold">본인부담상한제 환급 계산기</h1>
      <p className="mb-6 text-muted">
        한 해 병원비가 소득분위별 상한액을 넘으면 초과분을 돌려받습니다. 2026년 기준으로
        계산합니다.
      </p>

      <CopayCapCalculator />

      <AdSlot slot="cap-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">일 년에 낸 병원비에 천장이 있습니다</h2>
        <p>
          1월 1일부터 12월 31일까지 건강보험이 적용된 진료비 중 본인이 부담한 금액이
          소득분위별 상한액을 넘으면, 그 초과분을 공단이 돌려줍니다. 큰 병에 걸려도
          가계가 무너지지 않게 하려는 장치입니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">2026년 상한액</h2>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-border-soft text-left">
                <th className="py-2 pr-3 font-bold">소득분위</th>
                <th className="py-2 pr-3 font-bold">일반</th>
                <th className="py-2 font-bold">요양병원 120일 초과</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">1분위 (하위 10%)</td><td className="py-2 pr-3">90만원</td><td className="py-2">143만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">2~3분위</td><td className="py-2 pr-3">112만원</td><td className="py-2">181만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">4~5분위</td><td className="py-2 pr-3">173만원</td><td className="py-2">245만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">6~7분위</td><td className="py-2 pr-3">326만원</td><td className="py-2">404만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">8분위</td><td className="py-2 pr-3">446만원</td><td className="py-2">580만원</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">9분위</td><td className="py-2 pr-3">536만원</td><td className="py-2">698만원</td></tr>
              <tr><td className="py-2 pr-3">10분위 (상위 10%)</td><td className="py-2 pr-3">843만원</td><td className="py-2">1,096만원</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          소득분위는 연봉이나 재산이 아니라 <strong>그해에 낸 건강보험료의 연평균</strong>
          으로 정해집니다. 직장가입자와 지역가입자를 같은 기준으로 봅니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          가장 중요한 것 — 비급여는 계산에 들어가지 않습니다
        </h2>
        <p>
          &ldquo;병원비를 수백만원 냈는데 환급이 없다&rdquo;는 문의가 가장 많습니다.
          거의 전부 이 이유입니다.
        </p>
        <p>
          본인부담상한제는 <strong>건강보험이 적용된 급여 항목</strong>의 본인부담금만
          계산합니다. 아래는 아무리 많이 내도 상한제와 무관합니다.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>상급병실료 차액 (1·2인실 추가금)</li>
          <li>도수치료·체외충격파 등 비급여 물리치료</li>
          <li>미용·성형 목적의 시술</li>
          <li>일부 신의료기술과 신약</li>
          <li>선택진료비, 제증명 수수료</li>
        </ul>
        <p>
          그래서 영수증을 볼 때 <strong>급여와 비급여가 나뉜 칸</strong>을 먼저 확인해야
          합니다. 총액이 커도 비급여가 대부분이면 환급 대상이 아닙니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">신청은 8월 이후에 안내가 옵니다</h2>
        <p>
          공단이 전년도 진료분을 정산해 대상자에게 안내문을 보냅니다. 보통{" "}
          <strong>8월 말 이후</strong>부터 순차적으로 나갑니다. 안내문의 신청서를
          제출하면 계좌로 입금됩니다.
        </p>
        <p>
          안내문을 못 받았어도 공단 홈페이지나 앱에서 조회할 수 있습니다. 소멸시효는
          3년이므로 지난 해 것도 확인해 볼 만합니다.
        </p>
        <p>
          <strong>사전급여</strong>라는 것도 있습니다. 같은 병원에서 상한액을 넘긴
          경우, 병원이 진료 중에 미리 정산해 초과분을 공단에 직접 청구하는 방식입니다.
          이 경우 환자는 상한액까지만 내고 끝납니다.
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
            law: "국민건강보험법 제44조 제2항 (본인일부부담금의 상한)",
            detail:
              "본인이 연간 부담하는 본인일부부담금의 총액이 대통령령으로 정하는 금액을 넘는 경우, 공단이 그 초과 금액을 부담합니다.",
          },
          {
            law: "같은 법 시행령 제19조 및 별표3",
            detail:
              "가입자의 소득수준 등에 따라 본인부담상한액을 정합니다. 요양병원에 120일을 초과해 입원한 경우에는 별도의 높은 상한액이 적용됩니다.",
          },
          {
            law: "국민건강보험공단 「2026년도 본인부담상한액 안내」",
            detail:
              "일반 기준 1분위 90만원, 2~3분위 112만원, 4~5분위 173만원, 6~7분위 326만원, 8분위 446만원, 9분위 536만원, 10분위 843만원입니다. 요양병원 120일 초과 시 각각 143·181·245·404·580·698·1,096만원입니다.",
          },
          {
            law: "적용 제외 — 비급여",
            detail:
              "건강보험이 적용되지 않는 비급여 항목(상급병실료 차액, 선택진료비, 미용·성형, 일부 신의료기술 등)은 본인부담상한제 대상이 아닙니다.",
          },
        ]}
        note="상한액은 매년 1월 전국소비자물가변동률을 반영해 조정됩니다. 소득분위는 공단이 그해 보험료를 기준으로 산정하므로 예상과 다를 수 있습니다. 실손보험금을 이미 받은 경우 이중 보상 조정이 있을 수 있으니 보험 약관을 확인하세요."
        examples={[
          {
            title: "4~5분위 · 급여 본인부담 300만원 · 비급여 없음",
            steps: [
              "적용 상한액 = 173만원",
              "300만원 − 173만원 = 127만원",
            ],
            result: "환급 127만원 · 최종 부담 173만원",
          },
          {
            title: "같은 조건인데 비급여가 500만원 더 있는 경우",
            steps: [
              "급여 본인부담 300만원 → 환급은 그대로 127만원",
              "비급여 500만원은 상한제 대상이 아님",
              "최종 부담 = 173만원 + 500만원",
            ],
            result: "환급은 같은 127만원 · 최종 부담은 673만원",
          },
          {
            title: "4~5분위 · 요양병원 121일 입원 · 급여 본인부담 300만원",
            steps: [
              "120일을 넘겨 장기입원 상한 245만원 적용",
              "300만원 − 245만원 = 55만원",
            ],
            result: "환급 55만원 — 하루 차이로 72만원을 더 부담합니다",
          },
        ]}
        pitfalls={[
          {
            heading: "총 진료비가 아니라 '본인부담금'입니다",
            body:
              "영수증의 진료비 총액이 아니라, 그중 본인이 실제로 낸 급여 본인부담금을 넣어야 합니다. 공단 부담분은 빼고 계산합니다.",
          },
          {
            heading: "가족 것을 합칠 수 없습니다",
            body:
              "본인부담상한제는 개인별로 적용됩니다. 배우자나 자녀의 의료비를 합산하지 않습니다. 같은 세대여도 각자 따로 계산합니다.",
          },
          {
            heading: "안내문을 못 받아도 조회할 수 있습니다",
            body:
              "공단 홈페이지나 The건강보험 앱에서 환급금 조회가 가능합니다. 소멸시효가 3년이므로 지난 해 것도 확인해 보세요.",
          },
          {
            heading: "연도가 바뀌면 다시 0부터입니다",
            body:
              "1월 1일부터 12월 31일까지의 진료가 기준입니다. 12월과 1월에 나눠 치료를 받으면 각각 다른 해로 계산되어 상한을 넘기기 어려워집니다. 큰 치료가 연말에 걸린다면 참고할 만합니다.",
          },
        ]}
        sources={[
          { label: "국민건강보험공단 환급금 조회", href: "https://www.nhis.or.kr" },
          { label: "건강보험공단 고객센터 1577-1000", href: "https://www.nhis.or.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
          { label: "병원비 본인부담률 계산기", href: "/calc/rate" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li><Link href="/calc/rate" className="text-accent underline-offset-4 hover:underline">병원비 본인부담률 계산기 →</Link></li>
          <li><Link href="/calc/dependent" className="text-accent underline-offset-4 hover:underline">피부양자 자격 판정 →</Link></li>
          <li><Link href="/guide/covered-vs-not" className="text-accent underline-offset-4 hover:underline">급여와 비급여, 영수증 읽는 법 →</Link></li>
        </ul>
      </section>
      <CalcGuides calcHref="/calc/cap" />
    </div>
  );
}
