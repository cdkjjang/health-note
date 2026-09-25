import { noteLook } from "@/lib/note-look";

/**
 * 가이드 머리 그림 — 공책 한 장 위에 이 노트의 스티커를 붙이고, 오른쪽 가장자리에
 * 글의 섹션 수만큼 색인 탭을 단다(탭 수가 곧 이 글의 목차 수다).
 *
 * 공유·검색용 대표 이미지(opengraph-image)는 제목이 들어 있어 본문 제목 바로 아래
 * 두면 같은 말이 두 번 보인다. 본문에는 글자 없는 그림을 따로 둔다.
 * 스티커 위치·기울기·낙서는 슬러그에서 계산해 글마다 다르지만 새로고침해도 같다.
 * 허브(lifebanjang-hub)의 GuideBanner와 같은 그림체다.
 */
function seeded(slug: string) {
  let h = 2166136261;
  for (const c of slug) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (i: number) => {
    const x = Math.sin(h + i * 97.13) * 10000;
    return x - Math.floor(x);
  };
}

// 손으로 그린 듯한 낙서 — 24×24 캔버스
const DOODLES = [
  "M12 3l2.4 5.6 6 .5-4.6 3.9 1.4 5.9L12 16l-5.2 2.9 1.4-5.9L3.6 9.1l6-.5z", // 별
  "M4 14c3-6 6-6 8 0s5 6 8 0", // 물결
  "M4 12h13M13 7l5 5-5 5", // 화살표
  "M12 4a8 8 0 1 0 0.01 0", // 동그라미
  "M5 19 19 5M5 5l14 14", // 가위표
  "M4 18c4-1 6-4 6-8s3-6 10-6", // 곡선
];

export default function GuideBanner({ slug, note, sections }: { slug: string; note: string; sections: number }) {
  const look = noteLook(note);
  const rnd = seeded(slug);
  const W = 800;
  const H = 220;
  const tile = 120;
  const x = 90 + rnd(1) * 150;
  const y = (H - tile) / 2 + (rnd(2) - 0.5) * 24;
  const rot = (rnd(3) - 0.5) * 16;
  const cx = x + tile / 2;
  const cy = y + tile / 2;
  const doodles = [0, 1, 2].map((i) => DOODLES[Math.floor(rnd(10 + i) * DOODLES.length)]);
  const tabs = Math.min(Math.max(sections, 1), 8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 h-auto w-full rounded-xl" role="presentation" aria-hidden focusable="false">
      <rect width={W} height={H} fill={look.color} />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={0} x2={W} y1={24 + i * 30} y2={24 + i * 30} stroke="#fff" strokeOpacity={0.09} strokeWidth={1.5} />
      ))}
      <line x1={60} x2={60} y1={0} y2={H} stroke="#fff" strokeOpacity={0.22} strokeWidth={2} />

      {/* 색인 탭 — 섹션 수만큼 */}
      {Array.from({ length: tabs }).map((_, i) => (
        <rect key={i} x={W - 26} y={18 + i * ((H - 36) / tabs)} width={40} height={(H - 36) / tabs - 6} rx={5} fill="#fff" opacity={0.18 + (i % 2) * 0.1} />
      ))}

      <g transform={`translate(${W - 290} 14) scale(9.5)`} opacity={0.13}>
        {look.paths.map((d) => (
          <path key={d} d={d} fill="none" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </g>

      {doodles.map((d, i) => (
        <g
          key={i}
          transform={`translate(${x + tile + 40 + i * 70 + rnd(20 + i) * 20} ${40 + rnd(30 + i) * 120}) scale(${1.3 + rnd(40 + i)}) rotate(${(rnd(50 + i) - 0.5) * 40} 12 12)`}
          opacity={0.45}
        >
          <path d={d} fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      <g transform={`rotate(${rot.toFixed(1)} ${cx} ${cy})`}>
        <rect x={x + 3} y={y + 5} width={tile} height={tile} rx={20} fill="#000" opacity={0.14} />
        <rect x={x} y={y} width={tile} height={tile} rx={20} fill="#fff" />
        <rect x={cx - 22} y={y - 10} width={44} height={17} rx={2} fill="#fff" opacity={0.55} transform={`rotate(${(rnd(4) - 0.5) * 20} ${cx} ${y - 1})`} />
        <g transform={`translate(${x + 22} ${y + 22}) scale(${(tile - 44) / 24})`}>
          {look.paths.map((d) => (
            <path key={d} d={d} fill="none" stroke={look.color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
      </g>
    </svg>
  );
}
