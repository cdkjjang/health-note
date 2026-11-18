"use client"; // 오류 경계는 클라이언트 컴포넌트여야 한다

import Link from "next/link";

// 페이지를 그리다 오류가 나면 Next 기본 화면(영어) 대신 이 안내를 보여 준다(2026-11-20).
// ⚠️ Next 16의 error.js는 `reset`이 아니라 `retry`를 넘긴다(node_modules/next/dist/docs 확인).
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="py-10 text-center">
      <p className="text-5xl font-extrabold text-accent">잠시만요</p>
      <h1 className="mt-4 text-2xl font-extrabold">화면을 불러오지 못했습니다</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        페이지를 그리는 중에 문제가 생겼습니다. 다시 시도해 보시고, 계속되면
        처음 화면에서 다시 찾아 주세요.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-[44px] items-center rounded-xl bg-accent px-6 font-bold text-on-accent transition-colors hover:bg-accent-strong"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-border-soft px-6 font-bold transition-colors hover:border-accent"
        >
          처음 화면으로
        </Link>
      </div>
    </div>
  );
}
