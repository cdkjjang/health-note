"use client";

export default function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="mb-6">
      <legend className="mb-2.5 font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`rounded-full border px-4 py-2.5 text-[15px] transition-all ${
              value === opt.value
                ? "border-accent bg-accent font-semibold text-white shadow-md"
                : "border-border-soft bg-card hover:border-accent hover:shadow-sm"
            }`}
          >
            <span>{opt.label}</span>
            {opt.hint && (
              <span className={`ml-1 text-xs ${value === opt.value ? "text-white/85" : "text-muted"}`}>
                · {opt.hint}
              </span>
            )}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
