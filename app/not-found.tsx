import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-10 text-center">
      <p className="text-5xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-extrabold">페이지를 찾을 수 없습니다</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        주소가 바뀌었거나 삭제된 페이지입니다. 찾으시던 것이 아래에 있을지도
        몰라요.
      </p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left">
        <Link
          href="/calc/dependent"
          className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent"
        >
          <span className="font-bold">피부양자 자격 판정</span>
          <span className="block text-sm text-muted">보험료 0원이 되는 조건</span>
        </Link>
        <Link
          href="/calc/cap"
          className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent"
        >
          <span className="font-bold">본인부담상한제 환급</span>
          <span className="block text-sm text-muted">병원비 돌려받기</span>
        </Link>
        <Link
          href="/guide"
          className="rounded-xl border border-border-soft bg-card p-4 shadow-sm transition-all hover:border-accent"
        >
          <span className="font-bold">건강보험 가이드 전체 보기</span>
          <span className="block text-sm text-muted">피부양자·환급·검진·병원비</span>
        </Link>
      </div>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-accent px-6 py-2.5 font-bold text-white transition-colors hover:bg-accent-strong"
      >
        홈으로 가기
      </Link>
    </div>
  );
}