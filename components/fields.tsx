"use client";

// 계산기 공용 입력 필드 — 금액·숫자

const inputClass =
  "w-full rounded-xl border border-border-soft bg-card px-4 py-2.5 text-[15px] outline-none transition-colors focus:border-accent";

export function MoneyField({
  label,
  hint,
  unit = "만원",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="mb-5 block">
      <span className="mb-1.5 block font-bold">
        {label}
        {hint && <span className="ml-2 text-xs font-normal text-muted">{hint}</span>}
      </span>
      <span className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^\d.,]/g, "");
            onChange(cleaned);
          }}
        />
        <span className="shrink-0 text-sm text-muted">{unit}</span>
      </span>
    </label>
  );
}

/** "1,234.5" → 숫자. 비어 있거나 숫자가 아니면 null */
export function parseMoney(s: string): number | null {
  const cleaned = s.replace(/,/g, "").trim();
  if (cleaned === "") return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function DateField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mb-5 block">
      <span className="mb-1.5 block font-bold">
        {label}
        {hint && <span className="ml-2 text-xs font-normal text-muted">{hint}</span>}
      </span>
      <input
        type="date"
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-2xl border-2 border-accent bg-card p-5 shadow-sm">
      <p className="mb-3 text-sm font-bold text-accent-strong">{title}</p>
      {children}
    </div>
  );
}
