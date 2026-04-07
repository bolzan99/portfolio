"use client";

import { useState } from "react";

const data = {
  IEB: {
    cash: 216000,
    positions: [
      { ticker: "MELI", qty: 29, avg: 20449, price: 21150 },
      { ticker: "S29Y6", qty: 1982144, avg: 1.2612, price: 1.2751 },
      { ticker: "NU", qty: 46, avg: 10451, price: 10820 },
      { ticker: "META", qty: 7, avg: 34214.97, price: 35380 },
      { ticker: "GOOGL", qty: 80, avg: 7051.45, price: 7685 },
      { ticker: "AMZN", qty: 89, avg: 2117.3, price: 2192 }
    ]
  },
  IOL: {
    cash: 681000,
    positions: [
      { ticker: "GOOGL", qty: 39, avg: 7768, price: 7685 },
      { ticker: "AMZN", qty: 256, avg: 2112, price: 2192 },
      { ticker: "WFC", qty: 12, avg: 26876, price: 24250 },
      { ticker: "YPF", qty: 4, avg: 53701, price: 64925 },
      { ticker: "VIST", qty: 10, avg: 26265, price: 35040 },
      { ticker: "MELI", qty: 34, avg: 20966, price: 21150 },
      { ticker: "SPY", qty: 13, avg: 43234, price: 48880 },
      { ticker: "NU", qty: 18, avg: 10640, price: 10820 },
      { ticker: "META", qty: 5, avg: 36440, price: 35380 }
    ]
  }
};

function calc(p: any) {
  const invested = p.qty * p.avg;
  const current = p.qty * p.price;
  const pnl = current - invested;
  return { ...p, invested, current, pnl };
}

export default function Home() {
  const [tab, setTab] = useState("TOTAL");

  const brokers = Object.entries(data).map(([name, b]: any) => {
    const positions = b.positions.map(calc);
    const total = positions.reduce((a: number, p: any) => a + p.current, 0);
    const invested = positions.reduce((a: number, p: any) => a + p.invested, 0);

    return {
      name,
      cash: b.cash,
      positions,
      total,
      invested,
      pnl: total - invested
    };
  });

  const total = brokers.reduce(
    (acc, b) => {
      acc.total += b.total;
      acc.invested += b.invested;
      acc.cash += b.cash;
      return acc;
    },
    { total: 0, invested: 0, cash: 0 }
  );

  const selected =
    tab === "TOTAL"
      ? {
          name: "TOTAL",
          positions: brokers.flatMap((b) => b.positions),
          ...total,
          pnl: total.total - total.invested
        }
      : brokers.find((b) => b.name === tab);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      color: "#fff",
      padding: "16px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px" }}>
        BOLZAN INDUSTRIES
      </h1>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["TOTAL", "IEB", "IOL"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "none",
              color: "#fff",
              background: tab === t ? "#2563eb" : "#1f2937"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{
        background: "#111827",
        padding: "16px",
        borderRadius: "16px",
        marginBottom: "16px"
      }}>
        <p>Total: ${selected?.total.toLocaleString()}</p>
        <p>Invertido: ${selected?.invested.toLocaleString()}</p>
        <p style={{ color: selected && selected.pnl > 0 ? "#4ade80" : "#f87171" }}>
          PnL: ${selected?.pnl.toLocaleString()}
        </p>
        <p>Cash: ${selected?.cash.toLocaleString()}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {selected?.positions.map((p: any, i: number) => (
          <div
            key={i}
            style={{
              background: "#111827",
              padding: "14px",
              borderRadius: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontWeight: "bold" }}>{p.ticker}</div>
              <div style={{ fontSize: "13px", color: "#9ca3af" }}>
                {p.qty} @ {p.avg}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div>${p.current.toLocaleString()}</div>
              <div style={{ color: p.pnl > 0 ? "#4ade80" : "#f87171" }}>
                ${p.pnl.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
