"use client";

import { useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import OptionGroup from "./OptionGroup";
import { CAP_TIERS, calcCopayCap, longTermPenalty, type Decile } from "@/lib/copay-cap";
import { formatWon } from "@/lib/date";

function won(v: string): number {
  const n = parseMoney(v);
  return n === null ? 0 : n * 10_000;
}

export default function CopayCapCalculator() {
  const [decile, setDecile] = useState<string>("4");
  const [covered, setCovered] = useState("300");
  const [uncovered, setUncovered] = useState("0");
  const [days, setDays] = useState("0");

  const result = calcCopayCap({
    decile: Number(decile) as Decile,
    coveredCopay: won(covered),
    uncovered: won(uncovered),
    hospitalDays: parseMoney(days) ?? 0,
  });

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <OptionGroup
        label="소득분위"
        options={CAP_TIERS.map((t) => ({ value: String(t.key), label: t.label }))}
        value={decile}
        onChange={setDecile}
      />
      <p className="-mt-3 mb-5 text-sm text-muted">
        연봉이나 재산이 아니라 <strong>그해 낸 건강보험료의 연평균</strong>으로 정해집니다.
        직장·지역 구분 없이 같은 기준입니다.
      </p>

      <MoneyField
        label="한 해 동안 낸 급여 진료비 본인부담금"
        hint="영수증의 '급여' 항목 중 본인부담금 합계"
        unit="만원"
        value={covered}
        onChange={setCovered}
        placeholder="300"
      />
      <MoneyField
        label="비급여로 낸 금액"
        hint="상급병실료·도수치료·미용 등. 상한제 대상이 아닙니다"
        unit="만원"
        value={uncovered}
        onChange={setUncovered}
        placeholder="0"
      />
      <MoneyField
        label="요양병원 입원일수"
        hint="120일을 넘으면 상한액이 올라갑니다"
        unit="일"
        value={days}
        onChange={setDays}
        placeholder="0"
      />

      <ResultCard title={result.hasRefund ? "환급 예상액" : "환급 대상이 아닙니다"}>
        {result.hasRefund ? (
          <>
            <p className="text-3xl font-extrabold text-accent-strong">
              {formatWon(result.refund)}
            </p>
            <p className="mt-1 text-[15px] text-muted">
              급여 본인부담 {formatWon(won(covered))} − 상한액 {formatWon(result.cap)}
            </p>
          </>
        ) : (
          <p className="text-[15px] leading-relaxed text-muted">
            급여 본인부담금이 상한액 <strong>{formatWon(result.cap)}</strong>에 못 미칩니다.
            {result.remaining > 0 && (
              <> 앞으로 {formatWon(result.remaining)}을 더 부담하면 그 초과분부터 환급 대상이 됩니다.</>
            )}
          </p>
        )}

        <dl className="mt-4 space-y-1.5 border-t border-border-soft pt-4 text-[15px]">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">적용 상한액 ({result.tier.label})</dt>
            <dd>{formatWon(result.cap)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">급여 본인부담금</dt>
            <dd>{formatWon(won(covered))}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">비급여 (상한제 대상 아님)</dt>
            <dd>{formatWon(result.uncovered)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border-soft pt-2 font-bold">
            <dt>최종 부담</dt>
            <dd>{formatWon(result.finalBurden)}</dd>
          </div>
        </dl>

        {result.longTermApplied && (
          <div className="mt-4 rounded-xl border border-amber-400/50 bg-amber-500/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-amber-700 dark:text-amber-400">
              요양병원 120일 초과 상한이 적용됐습니다
            </p>
            <p className="mt-1.5 text-muted">
              일반 상한 {formatWon(result.tier.normal)} 대신{" "}
              {formatWon(result.tier.longTerm)}이 적용되어{" "}
              <strong>{formatWon(longTermPenalty(Number(decile) as Decile))}</strong>을 더
              부담합니다. 장기 입원을 통한 과다 이용을 막으려는 장치입니다.
            </p>
          </div>
        )}

        {result.uncoveredRatio > 0.3 && (
          <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/5 p-4 text-[15px] leading-relaxed">
            <p className="font-bold text-rose-600 dark:text-rose-400">
              지출의 {Math.round(result.uncoveredRatio * 100)}%가 비급여입니다
            </p>
            <p className="mt-1.5 text-muted">
              <strong>비급여는 상한제와 무관합니다.</strong> 아무리 많이 내도 환급 계산에
              들어가지 않습니다. &ldquo;병원비를 수백만원 냈는데 왜 환급이 없나&rdquo;는
              대부분 이 경우입니다. 상급병실료 차액, 도수치료, 미용·성형, 일부 신의료기술이
              여기 해당합니다.
            </p>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-border-soft p-4 text-[15px] leading-relaxed">
          <p className="font-bold">환급은 다음 해 8월 이후에 안내됩니다</p>
          <p className="mt-1.5 text-muted">
            공단이 전년도 진료분을 정산해 대상자에게 안내문을 보냅니다. 신청서를 내면
            계좌로 입금됩니다. 병원이 진료 중에 미리 정산해 주는 &lsquo;사전급여&rsquo;도
            있는데, 같은 병원에서 상한액을 넘긴 경우에 적용됩니다.
          </p>
        </div>
      </ResultCard>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        2026년도 본인부담상한액 기준입니다. 상한액은 매년 1월 전국소비자물가변동률을
        반영해 조정됩니다. 소득분위는 공단이 산정하므로 실제 적용 구간이 다를 수
        있습니다. 확정 금액은 국민건강보험공단(1577-1000)에서 확인하세요.
      </p>
    </div>
  );
}
