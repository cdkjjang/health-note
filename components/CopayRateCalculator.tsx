"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import OptionGroup from "./OptionGroup";
import {
  FACILITIES,
  SPECIAL_CASES,
  calcCopayRate,
  type Facility,
  type SpecialCase,
  type VisitType,
} from "@/lib/copay-rate";
import { formatWon } from "@/lib/date";

function won(v: string): number {
  const n = parseMoney(v);
  return n === null ? 0 : n * 10_000;
}

export default function CopayRateCalculator() {
  const [covered, setCovered] = useState("10");
  const [uncovered, setUncovered] = useState("0");
  const [facility, setFacility] = useState<Facility>("clinic");
  const [visit, setVisit] = useState<VisitType>("outpatient");
  const [special, setSpecial] = useState<SpecialCase>("none");

  const result = calcCopayRate({
    coveredTotal: won(covered),
    uncovered: won(uncovered),
    facility,
    visit,
    specialCase: special,
  });

  const saving = result.totalPay - result.ifClinic;

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="급여 대상 진료비 (총액)"
        hint="공단 부담분까지 포함한 금액입니다. 영수증의 '급여' 합계"
        unit="만원"
        value={covered}
        onChange={setCovered}
        placeholder="10"
      />
      <MoneyField
        label="비급여 금액"
        hint="전액 본인 부담입니다"
        unit="만원"
        value={uncovered}
        onChange={setUncovered}
        placeholder="0"
      />

      <OptionGroup
        label="외래인가요 입원인가요"
        options={[
          { value: "outpatient" as const, label: "외래" },
          { value: "inpatient" as const, label: "입원", hint: "종별 무관 20%" },
        ]}
        value={visit}
        onChange={setVisit}
      />

      {visit === "outpatient" && (
        <OptionGroup
          label="의료기관 종별"
          options={FACILITIES.map((f) => ({
            value: f.key,
            label: f.label,
            hint: `${Math.round(f.outpatient * 100)}%`,
          }))}
          value={facility}
          onChange={setFacility}
        />
      )}

      <OptionGroup
        label="산정특례 대상인가요"
        options={SPECIAL_CASES.map((s) => ({ value: s.key, label: s.label, hint: s.hint }))}
        value={special}
        onChange={setSpecial}
      />

      <ResultCard title="실제로 내는 금액">
        <p className="text-3xl font-extrabold text-accent-strong">
          {formatWon(result.totalPay)}
        </p>
        <p className="mt-1 text-[15px] text-muted">
          적용 본인부담률 {Math.round(result.rate * 100)}%
          {result.specialApplied && " (산정특례)"}
          {result.uncovered > 0 && ` · 실질 부담률 ${Math.round(result.effectiveRate * 100)}%`}
        </p>

        <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">급여 진료비 총액</dt>
            <dd>{formatWon(result.grandTotal - result.uncovered)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">→ 공단 부담</dt>
            <dd>{formatWon(result.insurerPays)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">→ 본인 부담</dt>
            <dd>{formatWon(result.coveredCopay)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">비급여 (전액 본인)</dt>
            <dd>{formatWon(result.uncovered)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border-soft pt-2 font-bold">
            <dt>내는 돈</dt>
            <dd>{formatWon(result.totalPay)}</dd>
          </div>
        </dl>

        {visit === "outpatient" && !result.specialApplied && saving > 0 && (
          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-accent-strong">
              같은 진료를 의원에서 받으면 {formatWon(saving)} 적습니다
            </p>
            <p className="mt-1.5 text-muted">
              외래 본인부담률이 의원 30%, 병원 40%, 종합병원 50%, 상급종합병원 60%로
              정해져 있기 때문입니다. <strong>상급종합병원은 의원의 두 배</strong>입니다.
              중증 환자를 보라고 만든 곳이라 경증 진료에는 부담을 크게 지웁니다.
            </p>
          </div>
        )}

        {result.uncovered > 0 && result.effectiveRate > result.rate + 0.1 && (
          <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-rose-600 dark:text-rose-400">
              명목 {Math.round(result.rate * 100)}%인데 실제로는{" "}
              {Math.round(result.effectiveRate * 100)}%를 냅니다
            </p>
            <p className="mt-1.5 text-muted">
              비급여 때문입니다. <strong>비급여는 본인부담률과 무관하게 전액 본인
              부담</strong>이고, 본인부담상한제로도 돌려받지 못합니다. 병원비가 예상보다
              많이 나오는 경우는 대개 여기서 갈립니다. 영수증에서 급여와 비급여가 나뉜
              칸을 확인해 보세요.
            </p>
          </div>
        )}

        {result.specialApplied && (
          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-accent-strong">
              산정특례는 종별 부담률을 덮어씁니다
            </p>
            <p className="mt-1.5 text-muted">
              상급종합병원에서 받아도 {Math.round(result.rate * 100)}%만 냅니다. 다만
              등록해야 적용되고, 해당 질환 관련 진료에만 적용됩니다. 감기로 간 진료에는
              적용되지 않습니다.
            </p>
          </div>
        )}
      </ResultCard>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        의원급 65세 이상 정률·정액 경감, 임신부·아동 외래 경감, 의료급여 수급자,
        연간 외래 365회 초과 시 본인부담률 상향은 반영하지 않았습니다. 입원 식대(50%)와
        상급병실료도 별도입니다. 참고용 추정치이며 실제 청구는 의료기관의 산정에 따릅니다.
      </p>
    </div>
  );
}
