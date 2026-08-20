import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description:
    "퇴사노트는 실업급여 금액과 수급자격, 조기재취업수당, 퇴사 후 건강보험을 계산기와 가이드로 정리한 생활 정보 서비스입니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">{SITE_NAME} 소개</h1>
      <p>
        {SITE_NAME}는 회사를 그만둔 뒤에 챙겨야 할 것들을 미리 확인하는 무료
        도구 모음입니다. 실업급여를 하루에 얼마씩 며칠 받는지, 내 퇴사 사유로
        받을 수 있는지, 언제까지 신청해야 손해가 없는지, 건강보험료는 얼마나
        오르는지를 몇 가지 값만 넣어 바로 계산합니다.
      </p>
      <p>
        퇴사 직후는 챙길 것이 많고 정신이 없는 시기입니다. 그런데 하필 그때
        여러 기한이 동시에 돌아가기 시작합니다. 실업급여 수급기간 12개월,
        건강보험 임의계속가입 신청 2개월, 부당해고 구제신청 3개월 같은
        것들입니다. <strong>이 가운데 몇몇은 놓치면 되돌릴 방법이 없습니다.</strong>{" "}
        이 사이트가 금액뿐 아니라 날짜를 함께 보여주는 이유입니다.
      </p>
      <p>
        모든 계산은 고용보험법과 같은 법 시행령·시행규칙, 고용노동부 고시,
        국민건강보험법 등 공개된 기준을 근거로 합니다. 각 계산기 페이지에 어떤
        조문과 고시를 적용했는지 함께 표기하고, 기준이 개정되면 계산 로직과
        설명을 함께 갱신한 뒤 갱신일을 표시합니다. 경계값 중심의 자동 검증
        테스트를 두어, 고시값이 바뀌면 테스트가 먼저 실패하도록 해 두었습니다.
      </p>
      <p>
        이 사이트의 계산은 <strong>참고용 추정치</strong>이며 노무·법률
        자문이 아닙니다. 특히 수급자격은 회사가 제출한 이직확인서의 상실코드와
        고용센터의 사실관계 판단에 따라 결정되므로, 여기서 &ldquo;가능&rdquo;이
        나와도 결과가 다를 수 있습니다. 반대로 &ldquo;어렵다&rdquo;고 나와도
        정당한 이직 사유에 해당하면 받을 수 있습니다. 확정 판단은 고용노동부
        고객상담센터(1350)와 관할 고용센터에서 확인하세요.
      </p>
      <p>
        <strong>확정되지 않은 개편안은 계산에 넣지 않습니다.</strong> 예를 들어
        반복수급자 감액 규정은 여러 차례 논의됐지만 확정된 시행 내용이 없어
        반영하지 않았습니다. 발표만 된 안을 미리 넣으면 계산기가 틀린 답을
        내기 때문입니다. 확정되면 그때 반영합니다.
      </p>
      <p>
        입력한 급여와 날짜 정보는 이용자의 브라우저 안에서만 계산되며 서버로
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
        {SITE_NAME}는 생활반장(lifebanjang.com) 노트 시리즈의 하나입니다.
        급여노트가 재직 중에 받는 돈을 다룬다면, 이 노트는 그만둔 뒤의 것을
        다룹니다. 작성 기준과 근거 자료는{" "}
        <Link href="/editorial" className="text-accent underline-offset-4 hover:underline">
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
