import { noteLook } from "@/lib/note-look";

/**
 * 노트 아이콘. `tile`이면 노트 색 바탕의 둥근 사각형 안에 흰 선으로,
 * 아니면 노트 색 선으로만 그린다. 장식이므로 화면 낭독기에서는 숨긴다
 * (노트 이름은 항상 옆에 글자로 함께 나온다).
 */
export default function NoteIcon({
  slug,
  size = 20,
  tile = false,
  className = "",
}: {
  slug: string;
  size?: number;
  tile?: boolean;
  className?: string;
}) {
  const look = noteLook(slug);
  const svg = (
    <svg
      width={tile ? Math.round(size * 0.56) : size}
      height={tile ? Math.round(size * 0.56) : size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={tile ? "#fff" : look.color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={tile ? "" : className}
    >
      {look.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
  if (!tile) return svg;
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-[28%] ${className}`}
      style={{ width: size, height: size, backgroundColor: look.color }}
    >
      {svg}
    </span>
  );
}
