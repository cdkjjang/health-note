// 금액·날짜 유틸 (UTC 자정 기준으로 날짜만 다룬다 — 시간대에 따른 하루 밀림 방지)

/** 원 단위 금액을 "1,234,567원" 형태로 */
export function formatWon(n: number): string {
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

/** 큰 금액을 "12억 3,400만원"처럼 읽기 쉽게 (부동산 금액용) */
export function formatKoreanWon(n: number): string {
  const won = Math.round(n);
  if (won === 0) return "0원";
  const sign = won < 0 ? "-" : "";
  const abs = Math.abs(won);
  const eok = Math.floor(abs / 100_000_000);
  const man = Math.floor((abs % 100_000_000) / 10_000);
  const rest = abs % 10_000;
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0) parts.push(`${man.toLocaleString("ko-KR")}만`);
  if (rest > 0 || parts.length === 0) parts.push(`${rest.toLocaleString("ko-KR")}`);
  return `${sign}${parts.join(" ")}원`;
}

/** "YYYY-MM-DD" → UTC 자정 Date. 형식이 잘못되면 null */
export function parseDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  // 2026-02-31 같은 존재하지 않는 날짜 걸러내기
  if (d.toISOString().slice(0, 10) !== iso) return null;
  return d;
}

/** Date → "YYYY-MM-DD" */
export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** 두 날짜의 차이(일). b - a */
export function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** 날짜에 일수 더하기 */
export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000);
}

/**
 * 날짜에 개월 더하기. 말일 보정 — 1/31에 1개월을 더하면 2월 말일이 된다.
 */
export function addMonths(d: Date, months: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  const target = new Date(Date.UTC(y, m + months, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target;
}
