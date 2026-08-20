import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "건강보험노트는 피부양자 자격과 본인부담상한제 환급, 건강검진 대상, 병원비 본인부담률을 계산기와 가이드로 정리한 생활 정보 서비스입니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>
      <p>
        {SITE_NAME}는 건강보험에서 실제로 돈이 갈리는 지점을 확인하는 무료 도구
        모음입니다. 피부양자 자격이 되는지, 한 해 병원비를 얼마나 돌려받는지, 올해
        어떤 검진 대상인지, 같은 진료에 왜 다른 돈을 내는지를 몇 가지 값만 넣어
        바로 계산합니다.
      </p>
      <p>
        건강보험은 전 국민이 들어 있지만, 정작 금액이 갈리는 규칙은 잘 알려져 있지
        않습니다. 피부양자는 소득 2,000만원을 1원이라도 넘으면 구간별 감액 없이
        곧바로 탈락하고, 사업자등록이 있으면 사업소득 1원에도 자격을 잃습니다.
        본인부담상한제는 급여 항목만 계산해서, 비급여로 수백만원을 내도 환급이
        없습니다. <strong>모르면 손해를 보는 쪽으로 작동하는 규칙들입니다.</strong>
      </p>
      <p>
        모든 계산은 국민건강보험법과 같은 법 시행령·시행규칙, 국민건강보험공단의
        연도별 고시, 암관리법 시행령 등 공개된 기준을 근거로 합니다. 각 계산기
        페이지에 어떤 조문과 고시를 적용했는지 함께 표기하고, 기준이 개정되면 계산
        로직과 설명을 함께 갱신한 뒤 갱신일을 표시합니다. 고시값 자체를 숫자로
        고정하는 검증 테스트를 두어, 값이 낡으면 테스트가 먼저 실패하도록 해
        두었습니다.
      </p>
      <p>
        이 사이트의 계산은 <strong>참고용 추정치</strong>이며 의료·법률 자문이
        아닙니다. 피부양자 부양요건은 동거 여부와 다른 부양자의 존재를 공단이
        개별로 확인하고, 본인부담상한제의 소득분위도 공단이 그해 보험료로
        산정합니다. 그래서 여기서 &ldquo;자격 있음&rdquo;이 나와도 결과가 다를 수
        있습니다. 확정 판단은 국민건강보험공단(1577-1000)에서 확인하세요.
      </p>
      <p>
        <strong>확실하지 않은 것은 계산하지 않습니다.</strong> 지역가입자 보험료가
        그렇습니다. 재산을 60등급 점수표로 환산하는 방식인데 점수표와 점수당 금액이
        매년 바뀌고, 확인해 보니 출처마다 값이 달랐습니다. 어설픈 추정이 잘못된
        판단을 부르므로 계산에 넣지 않고 공단 모의계산으로 안내합니다.
      </p>
      <p>
        입력한 소득·재산·진료비 정보는 이용자의 브라우저 안에서만 계산되며 서버로
        전송·저장되지 않습니다. 회원가입도 없습니다. 문의는{" "}
        <a
          href="mailto:cdkjjang@gmail.com"
          className="text-accent underline-offset-4 hover:underline"
        >
          cdkjjang@gmail.com
        </a>
        으로 보내주세요.
      </p>
      <p>
        {SITE_NAME}는 생활반장(lifebanjang.com) 노트 시리즈의 하나입니다. 급여노트가
        재직 중의 4대보험을, 퇴사노트가 퇴직 후 임의계속가입을 다룬다면 이 노트는
        자격과 급여(給與), 검진 쪽을 맡습니다. 작성 기준과 근거 자료는{" "}
        <Link
          href="/editorial"
          className="text-accent underline-offset-4 hover:underline"
        >
          편집 원칙
        </Link>
        에 공개해 두었습니다.
      </p>
      <p>
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          홈으로 →
        </Link>
      </p>
    </div>
  );
}
