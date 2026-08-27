"use client";

import { useEffect, useState } from "react";
import { MoneyField, ResultCard, parseMoney } from "./fields";
import OptionGroup from "./OptionGroup";
import { calcCheckup, type Sex } from "@/lib/checkup";

const YES_NO = [
  { value: "no" as const, label: "아니오" },
  { value: "yes" as const, label: "예" },
];

export default function CheckupCalculator() {
  const [birthYear, setBirthYear] = useState("1980");
  const [sex, setSex] = useState<Sex>("female");
  const [nonOffice, setNonOffice] = useState<"yes" | "no">("no");
  const [liver, setLiver] = useState<"yes" | "no">("no");
  const [smoker, setSmoker] = useState<"yes" | "no">("no");

  // 국가검진 대상은 '올해 − 출생연도'와 출생연도 홀짝으로 갈린다. 즉 올해가 몇 년인지가
  // 결과를 뒤집는 입력이다. 이 페이지는 정적으로 미리 렌더링되므로 렌더 본문에서
  // new Date()를 부르면 서버 HTML에 **빌드 연도**가 굳어, 해가 바뀐 뒤 재배포 전까지
  // 대상 판정이 반대로 나온다(홀짝이 뒤집히기 때문). 그래서 마운트 후에 채운다.
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const by = parseMoney(birthYear);

  const result =
    year === null || by === null || by < 1900 || by > year
      ? null
      : calcCheckup({
          birthYear: by,
          year,
          sex,
          nonOffice: nonOffice === "yes",
          liverHighRisk: liver === "yes",
          heavySmoker: smoker === "yes",
        });

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5 shadow-sm">
      <MoneyField
        label="출생연도"
        hint="국가검진은 만 나이가 아니라 '올해 − 출생연도'로 봅니다"
        unit="년"
        value={birthYear}
        onChange={setBirthYear}
        placeholder="1980"
      />

      <OptionGroup
        label="성별"
        options={[
          { value: "female" as const, label: "여성" },
          { value: "male" as const, label: "남성" },
        ]}
        value={sex}
        onChange={setSex}
      />

      <OptionGroup
        label="비사무직 직장가입자인가요"
        options={YES_NO}
        value={nonOffice}
        onChange={setNonOffice}
      />
      <p className="-mt-3 mb-5 text-sm text-muted">
        생산·건설·운전직 등은 <strong>매년</strong> 일반건강검진 대상입니다.
      </p>

      <OptionGroup
        label="간암 고위험군인가요"
        options={YES_NO}
        value={liver}
        onChange={setLiver}
      />
      <p className="-mt-3 mb-5 text-sm text-muted">
        간경변증, B형·C형 간염 바이러스 보유자 등
      </p>

      <OptionGroup
        label="30갑년 이상 흡연력이 있나요"
        options={YES_NO}
        value={smoker}
        onChange={setSmoker}
      />
      <p className="-mt-3 mb-5 text-sm text-muted">
        하루 1갑 × 30년 = 30갑년. 폐암검진 대상 판정에 씁니다.
      </p>

      {result === null ? (
        <p className="text-muted">출생연도를 넣으면 올해 받을 검진이 나옵니다.</p>
      ) : (
        <ResultCard title={`${year}년 · 만 ${result.age}세 기준`}>
          <div
            className={`rounded-xl border p-4 ${
              result.general.eligible
                ? "border-accent/40 bg-accent/5"
                : "border-border-soft"
            }`}
          >
            <p className="flex items-baseline justify-between gap-4">
              <span className="font-bold">일반건강검진</span>
              <span
                className={`font-extrabold ${
                  result.general.eligible ? "text-accent-strong" : "text-muted"
                }`}
              >
                {result.general.eligible ? "대상" : "대상 아님"}
              </span>
            </p>
            <p className="mt-1.5 text-[15px] text-muted">{result.general.reason}</p>
            {result.general.nextYear && (
              <p className="mt-1 text-[15px] text-muted">
                다음 대상: <strong>{result.general.nextYear}년</strong>
              </p>
            )}
          </div>

          <p className="mt-5 mb-2 font-bold">
            암검진 — 올해 {result.eligibleCount}종 대상
          </p>
          <ul className="space-y-2.5">
            {result.cancers.map((c) => (
              <li
                key={c.screening.key}
                className={`rounded-xl border p-4 ${
                  c.eligible ? "border-accent/40 bg-accent/5" : "border-border-soft"
                }`}
              >
                <p className="flex items-baseline justify-between gap-4">
                  <span className="font-bold">{c.screening.name}</span>
                  <span
                    className={`text-sm font-extrabold ${
                      c.eligible ? "text-accent-strong" : "text-muted"
                    }`}
                  >
                    {c.eligible ? "대상" : "—"}
                  </span>
                </p>
                <p className="mt-1 text-[15px] text-muted">{c.reason}</p>
                {c.eligible && (
                  <p className="mt-1 text-sm text-muted">{c.screening.method}</p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl border border-border-soft p-4 text-[15px] leading-relaxed">
            <p className="font-bold">대부분 무료입니다</p>
            <p className="mt-1.5 text-muted">
              일반건강검진과 국가암검진은 공단이 비용을 부담합니다. 다만 대장암 1차
              검사에서 이상이 나와 받는 대장내시경 등 <strong>확진 검사</strong>와 일부
              항목은 본인부담이 있을 수 있습니다. 의료급여 수급자와 건강보험료 하위
              50%는 이마저도 지원됩니다.
            </p>
          </div>
        </ResultCard>
      )}

      <p className="mt-5 text-sm leading-relaxed text-muted">
        이 판정은 공개된 기준을 코드로 옮긴 참고용입니다. 실제 대상 여부는 국민건강보험공단
        홈페이지의 <strong>건강검진 대상조회</strong>에서 확인하세요. 전년도 미수검자
        추가 대상 등 예외가 있습니다. 검진 결과는 다음 해 대상 판정에 영향을 주지 않습니다.
      </p>
    </div>
  );
}
