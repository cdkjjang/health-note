"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import OptionGroup from "./OptionGroup";
import {
  RELATIONS,
  calcDependent,
  effectiveIncomeLimit,
  formatMoney,
  type Relation,
} from "@/lib/dependent";

const STATUS = {
  pass: { mark: "○", cls: "text-accent-strong" },
  warn: { mark: "△", cls: "text-amber-600 dark:text-amber-400" },
  fail: { mark: "✕", cls: "text-rose-600 dark:text-rose-400" },
} as const;

const YES_NO = [
  { value: "no" as const, label: "아니오" },
  { value: "yes" as const, label: "예" },
];

function won(v: string): number {
  const n = parseMoney(v);
  return n === null ? 0 : n * 10_000;
}

export default function DependentCalculator() {
  const [relation, setRelation] = useState<Relation>("lineal");
  const [age, setAge] = useState("68");
  const [disabled, setDisabled] = useState<"yes" | "no">("no");
  const [income, setIncome] = useState("1200");
  const [hasReg, setHasReg] = useState<"yes" | "no">("no");
  const [bizIncome, setBizIncome] = useState("0");
  const [property, setProperty] = useState("20000");

  const result = calcDependent({
    relation,
    age: parseMoney(age) ?? 0,
    disabled: disabled === "yes",
    totalIncome: won(income),
    hasBusinessReg: hasReg === "yes",
    businessIncome: won(bizIncome),
    propertyBase: won(property),
  });

  const limit = effectiveIncomeLimit(won(property));

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <OptionGroup
        label="직장가입자와의 관계"
        options={RELATIONS.map((r) => ({ value: r.key, label: r.label }))}
        value={relation}
        onChange={setRelation}
      />
      <p className="-mt-3 mb-5 text-sm text-muted">
        {RELATIONS.find((r) => r.key === relation)?.hint}
      </p>

      {relation === "sibling" && (
        <>
          <MoneyField label="나이" unit="세" value={age} onChange={setAge} placeholder="25" />
          <OptionGroup
            label="장애인·국가유공상이자인가요"
            options={YES_NO}
            value={disabled}
            onChange={setDisabled}
          />
        </>
      )}

      <MoneyField
        label="연간 합산소득"
        hint="이자·배당·사업·근로·연금·기타를 모두 더한 금액"
        unit="만원"
        value={income}
        onChange={setIncome}
        placeholder="1200"
      />

      <OptionGroup
        label="사업자등록이 있나요"
        options={YES_NO}
        value={hasReg}
        onChange={setHasReg}
      />
      <MoneyField
        label="사업소득"
        hint={hasReg === "yes" ? "사업자등록이 있으면 1원만 있어도 탈락합니다" : "사업자등록이 없으면 500만원까지 인정"}
        unit="만원"
        value={bizIncome}
        onChange={setBizIncome}
        placeholder="0"
      />

      <MoneyField
        label="재산세 과세표준"
        hint="시가가 아니라 과세표준입니다. 재산세 고지서에서 확인하세요"
        unit="만원"
        value={property}
        onChange={setProperty}
        placeholder="20000"
      />

      <ResultCard
        title={
          result.qualified
            ? result.hasWarning
              ? "조건부로 가능해 보입니다"
              : "피부양자 자격이 있는 것으로 보입니다"
            : "지금 조건으로는 어렵습니다"
        }
      >
        <ul className="space-y-3">
          {result.checks.map((c) => {
            const s = STATUS[c.status];
            return (
              <li key={c.label} className="flex gap-3">
                <span className={`shrink-0 text-lg font-bold ${s.cls}`}>{s.mark}</span>
                <span>
                  <span className="font-bold">{c.label}</span>
                  <span className="mt-0.5 block text-[15px] text-muted">{c.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>

        {limit !== null && (
          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-accent-strong">
              지금 재산 기준으로 소득 한도는 {formatMoney(limit)}입니다
            </p>
            <p className="mt-1.5 text-muted">
              {limit === 20_000_000
                ? "재산세 과세표준이 5억 4천만원 이하라 일반 기준인 2,000만원이 적용됩니다."
                : "재산세 과세표준이 5억 4천만원을 넘어 소득 한도가 1,000만원으로 내려갑니다. 재산이 있으면 소득 문턱이 낮아지는 구조입니다."}
              {result.incomeHeadroom > 0 && limit === 20_000_000 && (
                <>
                  {" "}현재 <strong>{formatMoney(result.incomeHeadroom)}</strong>의 여유가
                  있습니다.
                </>
              )}
            </p>
          </div>
        )}

        {result.qualified && (
          <div className="mt-4 rounded-xl border border-border-soft p-4 text-[15px] leading-relaxed">
            <p className="font-bold">피부양자가 되면 보험료가 0원입니다</p>
            <p className="mt-1.5 text-muted">
              직장가입자의 보험료도 늘지 않습니다. 피부양자 수와 무관하게 보수월액으로만
              산정하기 때문입니다. 자격이 된다면 가장 유리한 선택지입니다.
            </p>
          </div>
        )}
      </ResultCard>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        이 판정은 공개된 기준을 코드로 옮긴 참고용입니다. 최종 판단은 국민건강보험공단이
        합니다. 특히 부양요건은 가족관계와 실제 부양 여부를 개별로 확인하므로 결과가
        다를 수 있습니다. <strong>실업급여는 소득으로 보지 않습니다.</strong>
      </p>
    </div>
  );
}
