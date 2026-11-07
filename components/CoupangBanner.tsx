// 쿠팡 파트너스 배너 (2026-10-30 시험 게재, 2026-11-07 두 종류로 나눔).
// AdSlot이 이 컴포넌트를 함께 렌더링하므로 광고 자리(계산기·가이드 상세·홈)에만 나온다.
// 지금은 19곳이 같은 배너를 쓴다. 효과를 본 뒤 노트별 채널·상품으로 바꿀 것.
//
// kind="goldbox"  — 위쪽 자리. 골드박스(쿠팡이 매일 여는 특가 코너)로 가는 이미지 배너.
//                   실제 특가 페이지로 가므로 머리 문구에 '특가'를 써도 사실과 맞다.
// kind="recommend" — 아래쪽 자리. 고객 관심 기반 추천 다이나믹 배너(아래 설명).
//
// 화면 폭으로 배너를 고른다 — 768px(Tailwind md) 이상은 PC용 680×140, 그보다 좁으면 320×100.
// 본문 폭이 max-w-3xl(패딩 빼고 736px)이라 680이 들어간다. 처음 그릴 때 한 번만 고르고
// 창 크기를 바꿔도 다시 고르지 않는다.
//
// 공식 코드는 <script> 두 줄을 그 자리에 박는 방식인데, React는 innerHTML로 넣은
// 스크립트를 실행하지 않고 클라이언트 이동 때 다시 돌지도 않는다. 그래서 g.js를 한 번만
// 불러 두고 PartnersCoupang.G의 container 옵션으로 이 div 안에 iframe을 꽂는다.
//
// ⚠️ 수수료 고지 문구는 공정위 추천·보증 심사지침상 필수다. 지우지 말 것.

"use client";

import { useEffect, useRef } from "react";

const MOBILE_BANNER = {
  id: 1044822,
  template: "carousel",
  trackingCode: "AF6888890",
  width: "320",
  height: "100",
  tsource: "",
};

const PC_BANNER = {
  id: 1044856,
  template: "carousel",
  trackingCode: "AF6888890",
  width: "680",
  height: "140",
  tsource: "",
};

const PC_QUERY = "(min-width: 768px)";

const SCRIPT_SRC = "https://ads-partners.coupang.com/g.js";

declare global {
  interface Window {
    PartnersCoupang?: { G: new (options: Record<string, unknown>) => unknown };
  }
}

let loader: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.PartnersCoupang) return Promise.resolve();
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loader = null;
        reject(new Error("coupang script failed"));
      };
      document.head.appendChild(s);
    });
  }
  return loader;
}

// 골드박스 이미지 배너 — 쿠팡이 준 'HTML 태그'(링크 + 이미지) 그대로. 크기마다 추적 링크가 다르다.
// PC는 728×90 하나뿐이라 칸 폭(680)에 맞춰 비율대로 줄여 보인다.
// referrerpolicy="unsafe-url"은 쿠팡 코드에 들어 있던 것이다 — 수익 추적에 쓰이니 지우지 말 것.
const GOLDBOX_MOBILE = {
  href: "https://link.coupang.com/a/itiHOlbXjM",
  src: "https://ads-partners.coupang.com/banners/1047564?trackingCode=AF6888890&subId=&traceId=V0-301-969b06e95b87326d-I1047564&w=320&h=100",
  width: 320,
  height: 100,
};

const GOLDBOX_PC = {
  href: "https://link.coupang.com/a/itiJT8R30e",
  src: "https://ads-partners.coupang.com/banners/1047562?trackingCode=AF6888890&subId=&traceId=V0-301-969b06e95b87326d-I1047562&w=728&h=90",
  width: 728,
  height: 90,
};

function GoldboxLink({ banner, className }: { banner: typeof GOLDBOX_PC; className: string }) {
  return (
    <a
      href={banner.href}
      target="_blank"
      rel="sponsored noopener"
      referrerPolicy="unsafe-url"
      className={className}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- 쿠팡 서버가 노출을 세는 이미지라 그대로 불러야 한다 */}
      <img
        src={banner.src}
        width={banner.width}
        height={banner.height}
        alt="쿠팡 골드박스 오늘의 특가 바로가기"
        loading="lazy"
        className="h-auto w-full rounded-lg"
      />
    </a>
  );
}

function RecommendBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const banner = window.matchMedia(PC_QUERY).matches ? PC_BANNER : MOBILE_BANNER;
    loadScript()
      .then(() => {
        if (cancelled || !window.PartnersCoupang) return;
        el.innerHTML = "";
        new window.PartnersCoupang.G({ ...banner, container: el });
      })
      .catch(() => {
        // 광고 차단기 등으로 실패해도 페이지 동작에는 영향 없음
      });
    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
  }, []);

  // 배너 높이(모바일 100px · PC 140px)를 미리 잡아 둔다. 늦게 뜨면서 아래 내용을 밀면 잘못 누르기 쉽다.
  return (
    <div
      ref={ref}
      className="mx-auto min-h-[100px] max-w-[320px] overflow-hidden rounded-lg md:min-h-[140px] md:max-w-[680px]"
    />
  );
}

export default function CoupangBanner({ kind = "recommend" }: { kind?: "goldbox" | "recommend" }) {
  return (
    // 머리 문구 + 배너 + 고지 문구를 한 묶음으로 둔다. 폭은 배너에 맞춘다(모바일 320 · PC 680).
    // 모바일은 본문 폭이 328px 안팎이라 테두리·안쪽 여백을 넣으면 320 배너가 넘친다 — 카드 모양은 PC에서만.
    //
    // ⚠️ 추천(recommend) 배너의 머리 문구에 '세일·특가·할인'을 쓰지 말 것. '고객 관심 기반 추천'이라
    //    특가 상품이 나온다는 보장이 없다. 사실과 다른 문구로 클릭을 끌면 표시광고법상 기만 광고이고
    //    쿠팡 파트너스 약관의 부당 클릭 유도에도 걸린다. '특가'는 골드박스 배너에만 쓴다(2026-11-07).
    //    '오늘의'는 괜찮다 — 추천 상품이 들어올 때마다 바뀌므로 사실과 맞다(2026-10-30 사용자와 정함).
    <aside
      className="mx-auto my-6 w-full max-w-[320px] md:max-w-[706px] md:rounded-2xl md:border md:border-border-soft md:bg-card md:p-3"
      aria-label="쿠팡 파트너스 광고"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        {kind === "goldbox" ? (
          <p className="text-sm font-bold">
            쿠팡 <span className="text-accent">골드박스</span> 오늘의 특가
          </p>
        ) : (
          <p className="text-sm font-bold">
            오늘의 <span className="text-accent">쿠팡</span> 추천 상품
          </p>
        )}
        <span className="shrink-0 rounded border border-border-soft px-1.5 py-px text-[11px] text-muted">
          광고
        </span>
      </div>
      {kind === "goldbox" ? (
        // 두 크기를 모두 그려 두고 CSS로 하나만 보인다. 숨은 쪽은 loading="lazy"라 이미지를 받지 않는다.
        <>
          <GoldboxLink banner={GOLDBOX_MOBILE} className="mx-auto block max-w-[320px] md:hidden" />
          <GoldboxLink banner={GOLDBOX_PC} className="mx-auto hidden max-w-[680px] md:block" />
        </>
      ) : (
        <RecommendBanner />
      )}
      <p className="mt-2 text-[11px] leading-snug text-muted">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </aside>
  );
}
