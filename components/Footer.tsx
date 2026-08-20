import Link from "next/link";
import FamilyLinks from "@/components/FamilyLinks";
import { SITE_NAME } from "@/lib/site";

const TOOL_LINKS = [
  { href: "/calc/dependent", label: "피부양자 자격 판정" },
  { href: "/calc/cap", label: "본인부담상한제 환급" },
  { href: "/calc/checkup", label: "건강검진 대상 조회" },
  { href: "/calc/rate", label: "병원비 본인부담률" },
  { href: "/guide", label: "건강보험 가이드" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-soft bg-card">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted">
        <nav aria-label="사이트 바로가기" className="mb-5">
          <p className="mb-2 font-semibold text-foreground">{SITE_NAME} 도구</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {TOOL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <FamilyLinks />
        <p className="mb-3">
          {SITE_NAME}의 계산 결과는 국민건강보험법·암관리법 등 공개된 기준과
          국민건강보험공단 고시를 정리한 참고용 추정치이며, 의료·법률 자문이
          아닙니다. 자격 판정과 환급 금액은 공단이 최종 결정합니다.
          국민건강보험공단(1577-1000)에서 확인하세요.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-accent">
            소개
          </Link>
          <Link href="/editorial" className="hover:text-accent">
            편집 원칙
          </Link>
          <Link href="/contact" className="hover:text-accent">
            문의
          </Link>
          <Link href="/terms" className="hover:text-accent">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-accent">
            개인정보처리방침
          </Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} {SITE_NAME}</p>
      </div>
    </footer>
  );
}
