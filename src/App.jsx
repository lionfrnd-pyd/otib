import React, { useState } from "react";

function evaluateScore(sales, traffic, inventory) {
  const salesScore = Math.min(40, (sales / 80) * 40);
  const trafficScore = Math.min(35, (traffic / 900) * 35);
  const inventoryScore = Math.min(25, (inventory / 14) * 25);

  const total = Math.round(salesScore + trafficScore + inventoryScore);

  if (total >= 75) {
    return {
      total,
      level: "good",
      label: "안정 운영",
      actions: [
        "핵심 SKU 품절률을 주 1회 점검하세요.",
        "고객 피크 타임에 프로모션 시인성을 강화하세요.",
      ],
    };
  }

  if (total >= 50) {
    return {
      total,
      level: "mid",
      label: "개선 필요",
      actions: [
        "매출 상위 SKU 중심으로 진열 우선순위를 조정하세요.",
        "체류시간이 낮은 시간대의 행사 구성을 점검하세요.",
      ],
    };
  }

  return {
    total,
    level: "low",
    label: "긴급 점검",
    actions: [
      "재고 커버리지와 발주 리드타임을 즉시 재검토하세요.",
      "유동인구 대비 전환율이 낮은 원인을 현장 관찰로 확인하세요.",
    ],
  };
}

export default function App() {
  const [sales, setSales] = useState("");
  const [traffic, setTraffic] = useState("");
  const [inventory, setInventory] = useState("");
  const [result, setResult] = useState(null);

  const onSubmit = (event) => {
    event.preventDefault();
    setResult(evaluateScore(Number(sales), Number(traffic), Number(inventory)));
  };

  return (
    <>
      <div className="bg-shape bg-shape-one" aria-hidden="true" />
      <div className="bg-shape bg-shape-two" aria-hidden="true" />

      <main className="container">
        <header className="hero">
          <p className="eyebrow">OFFTRADE INBUILDING</p>
          <h1>매장 운영 상태를 30초 안에 확인하세요</h1>
          <p className="hero-text">
            일 매출, 유동인구, 재고 커버리지를 입력하면 운영 준비도를 점수와 액션 아이템으로
            즉시 보여줍니다.
          </p>
        </header>

        <section className="grid">
          <article className="card">
            <h2>운영 준비도 계산기</h2>
            <form className="form" onSubmit={onSubmit}>
              <label>
                일 매출 (만원)
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={sales}
                  onChange={(event) => setSales(event.target.value)}
                />
              </label>
              <label>
                일 유동인구 (명)
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={traffic}
                  onChange={(event) => setTraffic(event.target.value)}
                />
              </label>
              <label>
                재고 커버리지 (일)
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={inventory}
                  onChange={(event) => setInventory(event.target.value)}
                />
              </label>
              <button type="submit">점수 계산</button>
            </form>
          </article>

          <article className="card result-card" aria-live="polite">
            <h2>결과</h2>
            {!result && <p className="hint">값을 입력하고 계산 버튼을 눌러주세요.</p>}
            {result && (
              <>
                <p className={`badge ${result.level}`}>{result.label}</p>
                <p className="score">{result.total}점</p>
                <p>추천 액션</p>
                <ul>
                  {result.actions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </article>
        </section>
      </main>
    </>
  );
}
