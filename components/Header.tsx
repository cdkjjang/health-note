"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { href: "/calc/dependent", label: "피부양자" },
  { href: "/calc/cap", label: "환급" },
  { href: "/calc/checkup", label: "건강검진" },
  { href: "/calc/rate", label: "병원비" },
  { href: "/guide", label: "가이드" },
];

// 휴대폰에서 메뉴가 한 줄에 다 안 들어가면 옆으로 밀어 보게 된다. 밀 수 있다는 것을
// 알 수 있게 가려진 쪽 끝을 흐리게 하고(globals.css .nav-scroll), 지금 보고 있는
// 메뉴는 보이는 자리로 끌어온다. 2026-11-01: 375px에서 뒤쪽 메뉴가 표시 없이 숨어 있었다.
function useNavOverflow(pathname: string) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (active) {
      // scrollIntoView는 페이지까지 움직일 수 있어 메뉴 상자만 옮긴다
      const offset = active.getBoundingClientRect().left - nav.getBoundingClientRect().left;
      nav.scrollLeft += offset - (nav.clientWidth - active.offsetWidth) / 2;
    }
    const update = () => {
      // 창을 넓혀 넘침이 사라졌는데 scrollLeft가 늦게 0으로 돌아오는 경우가 있어 넘침부터 본다
      const overflows = nav.scrollWidth - nav.clientWidth > 1;
      nav.toggleAttribute("data-fade-left", overflows && nav.scrollLeft > 1);
      nav.toggleAttribute("data-fade-right", nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1);
    };
    update();
    nav.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(() => requestAnimationFrame(update)); // 크기가 바뀐 뒤 scrollLeft가 정리된 다음에 본다
    observer.observe(nav);
    return () => {
      nav.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [pathname]);
  return ref;
}

export default function Header() {
  const pathname = usePathname();
  const navRef = useNavOverflow(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-card/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="shrink-0 text-lg font-extrabold tracking-tight text-accent-strong">
          {SITE_NAME}
        </Link>
        <nav ref={navRef} className="nav-scroll -mr-1 flex min-w-0 items-center gap-0.5 overflow-x-auto whitespace-nowrap text-sm sm:gap-2">
          {NAV.map((item) => {
            const active =
              item.href === "/guide"
                ? pathname.startsWith("/guide")
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-2 py-1.5 transition-colors sm:px-3 ${
                  active
                    ? "bg-accent font-semibold text-on-accent"
                    : "hover:bg-border-soft/60 hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
