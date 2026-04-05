"use client";

import { useState, useCallback } from "react";
import { m } from "framer-motion";

// ── Colors ──
const PURPLE = "#534AB7";
const TEAL = "#2DD4BF";
const AMBER = "#F59E0B";
const CORAL = "#F87171";
const GREEN = "#34D399";
const CARD_BG = "rgba(255,255,255,0.06)";
const BORDER = "rgba(255,255,255,0.1)";
const TEXT = "rgba(255,255,255,0.85)";
const TEXT_DIM = "rgba(255,255,255,0.5)";

// ── Shared wrapper ──
function GfxWrap({ children, dir }: { children: React.ReactNode; dir?: string }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir={dir}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "24px 0",
      }}
    >
      {children}
    </m.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COURSE: how-llms-work
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── llms-what-is-llm: Token stream → transformer layers → output ──
function WhatIsLLM() {
  const tokens = ["שלום", "עולם", "היום", "אני", "לומד"];
  const layers = ["Layer 1", "Layer 2", "Layer 3", "Layer 4"];
  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 360 320" width="100%" style={{ maxWidth: 360 }}>
        {/* Input tokens sliding in */}
        {tokens.map((t, i) => (
          <m.g
            key={i}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <rect
              x={20 + i * 66}
              y={260}
              width={58}
              height={30}
              rx={6}
              fill={TEAL}
              fillOpacity={0.2}
              stroke={TEAL}
              strokeWidth={1}
            />
            <text
              x={20 + i * 66 + 29}
              y={280}
              textAnchor="middle"
              fill={TEAL}
              fontSize={12}
              fontFamily="sans-serif"
            >
              {t}
            </text>
          </m.g>
        ))}
        {/* Arrow up */}
        <m.line
          x1={180} y1={250} x2={180} y2={220}
          stroke={TEXT_DIM} strokeWidth={1.5}
          markerEnd="url(#arrowDown)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        />
        {/* Transformer layers */}
        {layers.map((l, i) => (
          <m.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + i * 0.25, duration: 0.3 }}
          >
            <rect
              x={60}
              y={190 - i * 44}
              width={240}
              height={34}
              rx={6}
              fill={PURPLE}
              fillOpacity={0.15 + i * 0.08}
              stroke={PURPLE}
              strokeWidth={1}
              strokeOpacity={0.5}
            />
            <text
              x={180}
              y={212 - i * 44}
              textAnchor="middle"
              fill={TEXT}
              fontSize={12}
              fontFamily="sans-serif"
            >
              {l}
            </text>
          </m.g>
        ))}
        {/* Arrow to output */}
        <m.line
          x1={180} y1={54} x2={180} y2={38}
          stroke={TEXT_DIM} strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 2.2, duration: 0.3 }}
        />
        {/* Output token */}
        <m.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.4 }}
        >
          <rect x={140} y={8} width={80} height={30} rx={6} fill={PURPLE} fillOpacity={0.3} stroke={PURPLE} strokeWidth={1.5} />
          <text x={180} y={28} textAnchor="middle" fill="white" fontSize={13} fontWeight={600} fontFamily="sans-serif">
            תוצאה
          </text>
        </m.g>
        <defs>
          <marker id="arrowDown" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto">
            <path d="M0,0 L8,4 L0,8" fill={TEXT_DIM} />
          </marker>
        </defs>
      </svg>
    </GfxWrap>
  );
}

// ── llms-how-model-thinks: Attention visualization ──
function HowModelThinks() {
  const tokens = ["the", "cat", "sat", "on", "mat"];
  const weights: Record<number, number[]> = {
    0: [0, 0.2, 0.1, 0.3, 0.1],
    1: [0.3, 0, 0.6, 0.2, 0.8],
    2: [0.1, 0.7, 0, 0.5, 0.3],
    3: [0.4, 0.2, 0.5, 0, 0.2],
    4: [0.1, 0.9, 0.3, 0.3, 0],
  };
  const [active, setActive] = useState<number | null>(null);
  const boxW = 56;
  const gap = 8;
  const totalW = tokens.length * boxW + (tokens.length - 1) * gap;
  const startX = (340 - totalW) / 2;

  return (
    <GfxWrap>
      <svg viewBox="0 0 340 180" width="100%" style={{ maxWidth: 340 }}>
        {/* Attention lines */}
        {active !== null &&
          tokens.map((_, j) => {
            if (j === active) return null;
            const w = weights[active][j];
            const fromX = startX + active * (boxW + gap) + boxW / 2;
            const toX = startX + j * (boxW + gap) + boxW / 2;
            return (
              <m.line
                key={j}
                x1={fromX} y1={80} x2={toX} y2={80}
                stroke={AMBER}
                strokeWidth={w * 6 + 0.5}
                strokeOpacity={0.4 + w * 0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        {/* Token boxes */}
        {tokens.map((t, i) => {
          const x = startX + i * (boxW + gap);
          const isActive = active === i;
          return (
            <g
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <rect
                x={x} y={55} width={boxW} height={34} rx={6}
                fill={isActive ? PURPLE : CARD_BG}
                fillOpacity={isActive ? 0.4 : 1}
                stroke={isActive ? PURPLE : BORDER}
                strokeWidth={isActive ? 2 : 1}
              />
              <text
                x={x + boxW / 2} y={77}
                textAnchor="middle"
                fill={isActive ? "white" : TEXT}
                fontSize={14}
                fontFamily="sans-serif"
                fontWeight={isActive ? 600 : 400}
              >
                {t}
              </text>
            </g>
          );
        })}
        {/* Instruction */}
        <text x={170} y={130} textAnchor="middle" fill={TEXT_DIM} fontSize={11} fontFamily="sans-serif">
          לחץ על טוקן לראות קשב
        </text>
      </svg>
    </GfxWrap>
  );
}

// ── llms-temperature: Temperature slider ──
function TemperatureGraphic() {
  const wordSets: Record<string, { word: string; prob: number }[]> = {
    low: [
      { word: "הולך", prob: 0.82 },
      { word: "רץ", prob: 0.09 },
      { word: "יושב", prob: 0.04 },
      { word: "עומד", prob: 0.03 },
      { word: "נע", prob: 0.02 },
    ],
    mid: [
      { word: "הולך", prob: 0.38 },
      { word: "רץ", prob: 0.24 },
      { word: "יושב", prob: 0.18 },
      { word: "עומד", prob: 0.12 },
      { word: "נע", prob: 0.08 },
    ],
    high: [
      { word: "הולך", prob: 0.22 },
      { word: "רץ", prob: 0.21 },
      { word: "יושב", prob: 0.20 },
      { word: "עומד", prob: 0.19 },
      { word: "נע", prob: 0.18 },
    ],
  };
  const [level, setLevel] = useState(0);
  const key = level === 0 ? "low" : level === 1 ? "mid" : "high";
  const labels = ["צפוי", "מאוזן", "יצירתי"];
  const tempValues = ["0.2", "1.0", "2.0"];
  const words = wordSets[key];

  return (
    <GfxWrap dir="rtl">
      <div style={{ width: "100%", maxWidth: 320 }}>
        {/* Slider */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: TEXT_DIM, fontSize: 12 }}>צפוי</span>
            <span style={{ color: TEXT_DIM, fontSize: 12 }}>יצירתי</span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: PURPLE,
              cursor: "pointer",
            }}
          />
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <span style={{
              color: PURPLE,
              fontSize: 13,
              fontWeight: 600,
              background: `${PURPLE}22`,
              padding: "2px 10px",
              borderRadius: 99,
            }}>
              טמפרטורה: {tempValues[level]} — {labels[level]}
            </span>
          </div>
        </div>
        {/* Word probabilities */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {words.map((w, i) => (
            <m.div
              key={`${key}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ width: 44, textAlign: "left", color: TEXT, fontSize: 14, fontFamily: "sans-serif" }}>
                {w.word}
              </span>
              <div style={{
                flex: 1,
                height: 18,
                background: CARD_BG,
                borderRadius: 4,
                overflow: "hidden",
              }}>
                <m.div
                  initial={{ width: 0 }}
                  animate={{ width: `${w.prob * 100}%` }}
                  transition={{ duration: 0.35 }}
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, ${PURPLE}, ${TEAL})`,
                    borderRadius: 4,
                  }}
                />
              </div>
              <span style={{ width: 36, textAlign: "right", color: TEXT_DIM, fontSize: 12, fontFamily: "monospace" }}>
                {Math.round(w.prob * 100)}%
              </span>
            </m.div>
          ))}
        </div>
      </div>
    </GfxWrap>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COURSE: prompting-mastery
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── prompting-context-is-everything: Stacking blocks ──
function ContextBlocks() {
  const blocks = [
    { label: "מי אתה", color: "rgba(255,255,255,0.15)", text: TEXT_DIM },
    { label: "מה אתה צריך", color: `${PURPLE}44`, text: PURPLE },
    { label: "למה אתה צריך את זה", color: `${TEAL}44`, text: TEAL },
  ];
  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 360 180" width="100%" style={{ maxWidth: 360 }}>
        {blocks.map((b, i) => (
          <m.g
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.35, duration: 0.4 }}
          >
            <rect
              x={20}
              y={130 - i * 48}
              width={160}
              height={38}
              rx={8}
              fill={b.color}
              stroke={b.text}
              strokeWidth={1}
              strokeOpacity={0.5}
            />
            <text
              x={100}
              y={155 - i * 48}
              textAnchor="middle"
              fill={b.text}
              fontSize={13}
              fontWeight={500}
              fontFamily="sans-serif"
            >
              {b.label}
            </text>
          </m.g>
        ))}
        {/* Arrow */}
        <m.path
          d="M200,95 L240,95"
          stroke={TEXT_DIM}
          strokeWidth={1.5}
          fill="none"
          markerEnd="url(#arrowR)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.4, duration: 0.3 }}
        />
        {/* Output card */}
        <m.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.7, duration: 0.4 }}
        >
          <rect
            x={250} y={72} width={95} height={46} rx={10}
            fill={CARD_BG}
            stroke={PURPLE}
            strokeWidth={1.5}
          />
          <text x={297} y={100} textAnchor="middle" fill="white" fontSize={12} fontWeight={600} fontFamily="sans-serif">
            תשובה מדויקת
          </text>
        </m.g>
        <defs>
          <marker id="arrowR" markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
            <path d="M0,0 L8,4 L0,8" fill={TEXT_DIM} />
          </marker>
        </defs>
      </svg>
    </GfxWrap>
  );
}

// ── prompting-say-what-you-dont-want: Comparison columns ──
function SayWhatYouDontWant() {
  const constraints = ["ללא נקודות", "קצר", "לא פורמלי"];
  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 360 220" width="100%" style={{ maxWidth: 360 }}>
        {/* LEFT column - bad */}
        <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
          {/* Prompt box */}
          <rect x={200} y={15} width={140} height={32} rx={6} fill={CARD_BG} stroke={BORDER} strokeWidth={1} />
          <text x={270} y={36} textAnchor="middle" fill={TEXT} fontSize={11} fontFamily="sans-serif">פרומפט בסיסי</text>
          {/* Arrow */}
          <line x1={270} y1={50} x2={270} y2={70} stroke={TEXT_DIM} strokeWidth={1} />
          {/* Messy output */}
          <rect x={210} y={75} width={120} height={50} rx={6} fill="rgba(239,68,68,0.08)" stroke={CORAL} strokeWidth={1} strokeOpacity={0.5} />
          <text x={270} y={98} textAnchor="middle" fill={TEXT_DIM} fontSize={10} fontFamily="sans-serif">פלט לא ממוקד</text>
          <text x={270} y={115} textAnchor="middle" fill={CORAL} fontSize={18}>✗</text>
        </m.g>
        {/* RIGHT column - good */}
        <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}>
          {/* Prompt box */}
          <rect x={20} y={15} width={140} height={32} rx={6} fill={CARD_BG} stroke={BORDER} strokeWidth={1} />
          <text x={90} y={36} textAnchor="middle" fill={TEXT} fontSize={11} fontFamily="sans-serif">פרומפט + הגבלות</text>
          {/* Constraint chips */}
          {constraints.map((c, i) => (
            <m.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 + i * 0.15 }}>
              <rect x={20 + i * 48} y={52} width={44} height={18} rx={9} fill={`${PURPLE}33`} stroke={PURPLE} strokeWidth={0.7} />
              <text x={20 + i * 48 + 22} y={64} textAnchor="middle" fill={PURPLE} fontSize={8} fontFamily="sans-serif">{c}</text>
            </m.g>
          ))}
          {/* Arrow */}
          <line x1={90} y1={74} x2={90} y2={90} stroke={TEXT_DIM} strokeWidth={1} />
          {/* Clean output */}
          <rect x={30} y={95} width={120} height={50} rx={6} fill="rgba(52,211,153,0.08)" stroke={GREEN} strokeWidth={1} strokeOpacity={0.5} />
          <text x={90} y={118} textAnchor="middle" fill={TEXT_DIM} fontSize={10} fontFamily="sans-serif">פלט ממוקד</text>
          <text x={90} y={136} textAnchor="middle" fill={GREEN} fontSize={18}>✓</text>
        </m.g>
        {/* Labels */}
        <m.text x={270} y={200} textAnchor="middle" fill={CORAL} fontSize={10} fontFamily="sans-serif"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          בלי הגבלות
        </m.text>
        <m.text x={90} y={200} textAnchor="middle" fill={GREEN} fontSize={10} fontFamily="sans-serif"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          עם הגבלות
        </m.text>
      </svg>
    </GfxWrap>
  );
}

// ── prompting-chain-of-thought: Two paths ──
function ChainOfThought() {
  const nodeH = 30;
  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 360 280" width="100%" style={{ maxWidth: 360 }}>
        {/* Path A - Direct (left side for RTL) */}
        <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <rect x={230} y={20} width={100} height={nodeH} rx={6} fill={CARD_BG} stroke={BORDER} strokeWidth={1} />
          <text x={280} y={40} textAnchor="middle" fill={TEXT} fontSize={11} fontFamily="sans-serif">שאלה</text>
        </m.g>
        <m.line x1={280} y1={50} x2={280} y2={80} stroke={TEXT_DIM} strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
        <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.3 }}>
          <rect x={225} y={85} width={110} height={nodeH} rx={6} fill="rgba(248,113,113,0.12)" stroke={CORAL} strokeWidth={1} />
          <text x={280} y={105} textAnchor="middle" fill={CORAL} fontSize={11} fontFamily="sans-serif">תשובה מיידית</text>
        </m.g>
        <m.text x={280} y={138} textAnchor="middle" fill={CORAL} fontSize={10} fontFamily="sans-serif" fillOpacity={0.7}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          לעתים קרובות שגוי
        </m.text>

        {/* Path B - Step by step (right side for RTL) */}
        {["שאלה", "צעד 1", "צעד 2", "צעד 3", "תשובה"].map((label, i) => {
          const y = 20 + i * 50;
          const isFirst = i === 0;
          const isLast = i === 4;
          const fillColor = isLast ? `${GREEN}1A` : isFirst ? CARD_BG : `${TEAL}15`;
          const strokeColor = isLast ? GREEN : isFirst ? BORDER : TEAL;
          const textColor = isLast ? GREEN : isFirst ? TEXT : TEAL;
          return (
            <m.g key={i}>
              {i > 0 && (
                <m.line x1={80} y1={y - 15} x2={80} y2={y} stroke={TEXT_DIM} strokeWidth={1}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2 + i * 0.25 }} />
              )}
              <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + i * 0.3, duration: 0.3 }}>
                <rect x={30} y={y + 2} width={100} height={nodeH} rx={6} fill={fillColor} stroke={strokeColor} strokeWidth={1} />
                <text x={80} y={y + 22} textAnchor="middle" fill={textColor} fontSize={11} fontFamily="sans-serif">{label}</text>
              </m.g>
            </m.g>
          );
        })}
        <m.text x={80} y={272} textAnchor="middle" fill={GREEN} fontSize={10} fontFamily="sans-serif" fillOpacity={0.7}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
          מדויק יותר
        </m.text>
      </svg>
    </GfxWrap>
  );
}

// ── prompting-iteration-loop: Circular flow ──
function IterationLoop() {
  const nodes = ["פרומפט", "פלט", "שיפור", "פרומפט טוב יותר"];
  const cx = 170, cy = 120, r = 80;
  // Position nodes at top, right, bottom, left
  const positions = [
    { x: cx, y: cy - r },         // top
    { x: cx + r, y: cy },         // right
    { x: cx, y: cy + r },         // bottom
    { x: cx - r, y: cy },         // left
  ];
  const nodeW = 90, nodeH = 28;

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 340 260" width="100%" style={{ maxWidth: 340 }}>
        {/* Curved arrows between nodes */}
        {positions.map((from, i) => {
          const to = positions[(i + 1) % 4];
          const midX = (from.x + to.x) / 2 + (i === 0 ? 20 : i === 1 ? 0 : i === 2 ? -20 : 0);
          const midY = (from.y + to.y) / 2 + (i === 0 ? 0 : i === 1 ? 20 : i === 2 ? 0 : -20);
          return (
            <m.path
              key={`arrow-${i}`}
              d={`M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`}
              fill="none"
              stroke={PURPLE}
              strokeWidth={1.2}
              strokeOpacity={0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4 + i * 0.35, duration: 0.4 }}
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((label, i) => {
          const { x, y } = positions[i];
          return (
            <m.g
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.3, duration: 0.3 }}
            >
              <rect
                x={x - nodeW / 2} y={y - nodeH / 2}
                width={nodeW} height={nodeH} rx={8}
                fill={CARD_BG} stroke={PURPLE} strokeWidth={1} strokeOpacity={0.6}
              />
              <text
                x={x} y={y + 4} textAnchor="middle"
                fill={TEXT} fontSize={11} fontWeight={500} fontFamily="sans-serif"
              >
                {label}
              </text>
            </m.g>
          );
        })}
        {/* Iteration counter */}
        <m.text
          x={cx} y={cy + 6}
          textAnchor="middle"
          fill={PURPLE}
          fontSize={11}
          fontFamily="monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          ×1  ×2  ×3
        </m.text>
      </svg>
    </GfxWrap>
  );
}

// ── prompting-few-shot: Pattern rows ──
function FewShot() {
  const rows = [
    { input: "קלט: שמח", output: "פלט: 😊", glow: false },
    { input: "קלט: עצוב", output: "פלט: 😢", glow: false },
    { input: "קלט: נרגש", output: "פלט: ?", glow: true },
  ];
  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 340 160" width="100%" style={{ maxWidth: 340 }}>
        {rows.map((row, i) => {
          const y = 20 + i * 48;
          const fillIn = row.glow ? CARD_BG : "rgba(255,255,255,0.04)";
          const strokeIn = row.glow ? PURPLE : BORDER;
          const fillOut = row.glow ? `${PURPLE}22` : "rgba(255,255,255,0.04)";
          const strokeOut = row.glow ? PURPLE : BORDER;
          return (
            <m.g
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.4, duration: 0.35 }}
            >
              <rect x={180} y={y} width={130} height={34} rx={6} fill={fillIn} stroke={strokeIn} strokeWidth={1} />
              <text x={245} y={y + 22} textAnchor="middle" fill={row.glow ? "white" : TEXT_DIM} fontSize={12} fontFamily="sans-serif">{row.input}</text>
              <line x1={168} y1={y + 17} x2={148} y2={y + 17} stroke={TEXT_DIM} strokeWidth={1} />
              <rect x={30} y={y} width={110} height={34} rx={6} fill={fillOut} stroke={strokeOut} strokeWidth={1} />
              <text x={85} y={y + 22} textAnchor="middle" fill={row.glow ? PURPLE : TEXT_DIM} fontSize={12} fontWeight={row.glow ? 600 : 400} fontFamily="sans-serif">{row.output}</text>
              {/* Pulsing glow on last row */}
              {row.glow && (
                <m.rect
                  x={29} y={y - 1} width={112} height={36} rx={7}
                  fill="none" stroke={PURPLE} strokeWidth={1.5}
                  animate={{ strokeOpacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </m.g>
          );
        })}
      </svg>
    </GfxWrap>
  );
}

// ── prompting-format-control: Format toggle ──
function FormatControl() {
  const formats = ["פסקה", "רשימה", "טבלה", "JSON"] as const;
  type Fmt = (typeof formats)[number];
  const [fmt, setFmt] = useState<Fmt>("פסקה");

  const content = {
    title: "נתוני מכירות",
    items: [
      { name: "מוצר א", value: "120" },
      { name: "מוצר ב", value: "85" },
      { name: "מוצר ג", value: "200" },
    ],
  };

  const renderContent = () => {
    switch (fmt) {
      case "פסקה":
        return (
          <p style={{ color: TEXT, fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            {content.title}: {content.items.map((it) => `${it.name} — ${it.value}`).join(", ")}.
          </p>
        );
      case "רשימה":
        return (
          <ul style={{ color: TEXT, fontSize: 13, lineHeight: 2, margin: 0, paddingRight: 20, listStyle: "disc" }}>
            {content.items.map((it, i) => (
              <li key={i}>{it.name}: {it.value}</li>
            ))}
          </ul>
        );
      case "טבלה":
        return (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "right", padding: "4px 8px", borderBottom: `1px solid ${BORDER}`, color: TEXT_DIM }}>מוצר</th>
                <th style={{ textAlign: "right", padding: "4px 8px", borderBottom: `1px solid ${BORDER}`, color: TEXT_DIM }}>ערך</th>
              </tr>
            </thead>
            <tbody>
              {content.items.map((it, i) => (
                <tr key={i}>
                  <td style={{ padding: "4px 8px", color: TEXT }}>{it.name}</td>
                  <td style={{ padding: "4px 8px", color: TEXT }}>{it.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "JSON":
        return (
          <pre style={{
            color: TEAL, fontSize: 12, margin: 0,
            background: "rgba(255,255,255,0.03)",
            padding: 10, borderRadius: 6,
            direction: "ltr", textAlign: "left",
            overflowX: "auto",
          }}>
            {JSON.stringify(content.items.reduce((o, it) => ({ ...o, [it.name]: Number(it.value) }), {}), null, 2)}
          </pre>
        );
    }
  };

  return (
    <GfxWrap dir="rtl">
      <div style={{ width: "100%", maxWidth: 320 }}>
        {/* Format toggle buttons */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, justifyContent: "center" }}>
          {formats.map((f) => (
            <button
              key={f}
              onClick={() => setFmt(f)}
              style={{
                padding: "5px 14px",
                borderRadius: 8,
                border: `1px solid ${fmt === f ? PURPLE : BORDER}`,
                background: fmt === f ? `${PURPLE}33` : "transparent",
                color: fmt === f ? "white" : TEXT_DIM,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "sans-serif",
                transition: "all 0.2s",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        {/* Content area */}
        <m.div
          key={fmt}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: 14,
            overflow: "hidden",
          }}
        >
          {renderContent()}
        </m.div>
      </div>
    </GfxWrap>
  );
}

// ── prompting-chaining-tasks: Chain flowchart ──
function ChainingTasks() {
  const nodes = ["מחקר", "מתווה", "טיוטה"];
  const nodeW = 80, nodeH = 34;
  const startX = 280;
  const gap = 40;

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 360 190" width="100%" style={{ maxWidth: 360 }}>
        {/* Chain nodes */}
        {nodes.map((label, i) => {
          const x = startX - i * (nodeW + gap);
          return (
            <m.g key={i}>
              {i > 0 && (
                <m.line
                  x1={x + nodeW + 4} y1={40} x2={x + nodeW + gap - 4} y2={40}
                  stroke={TEAL} strokeWidth={1.2} strokeOpacity={0.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4 + i * 0.4, duration: 0.3 }}
                />
              )}
              <m.g
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.4, duration: 0.35 }}
              >
                <rect
                  x={x} y={23} width={nodeW} height={nodeH} rx={8}
                  fill={`${TEAL}15`} stroke={TEAL} strokeWidth={1} strokeOpacity={0.6}
                />
                <text x={x + nodeW / 2} y={45} textAnchor="middle" fill={TEAL} fontSize={13} fontWeight={500} fontFamily="sans-serif">
                  {label}
                </text>
                {/* Small data connector */}
                {i < nodes.length - 1 && (
                  <m.rect
                    x={x - 3} y={50} width={6} height={6} rx={1}
                    fill={TEAL} fillOpacity={0.5}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.4 }}
                  />
                )}
              </m.g>
            </m.g>
          );
        })}
        {/* Crossed-out mega prompt */}
        <m.g
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.4 }}
        >
          <rect x={80} y={105} width={200} height={34} rx={8} fill="rgba(248,113,113,0.08)" stroke={CORAL} strokeWidth={1} strokeOpacity={0.4} />
          <text x={180} y={127} textAnchor="middle" fill={CORAL} fontSize={12} fontFamily="sans-serif" fillOpacity={0.7}>
            מגה-פרומפט אחד
          </text>
          <line x1={85} y1={108} x2={275} y2={136} stroke={CORAL} strokeWidth={1.5} strokeOpacity={0.6} />
        </m.g>
        {/* Label */}
        <m.text x={180} y={170} textAnchor="middle" fill={TEAL} fontSize={11} fontWeight={500} fontFamily="sans-serif"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
          שרשרת = איכות גבוהה יותר
        </m.text>
      </svg>
    </GfxWrap>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COURSE: choosing-models
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── choosing-what-are-llms-really: Three model columns ──
function WhatAreLLMsReally() {
  const models = [
    { name: "Claude", color: PURPLE, traits: ["ניתוח", "ארוך"] },
    { name: "ChatGPT", color: TEAL, traits: ["כלים", "תמונות"] },
    { name: "Gemini", color: AMBER, traits: ["חיפוש", "עדכני"] },
  ];
  const colW = 90, colGap = 20;
  const totalW = models.length * colW + (models.length - 1) * colGap;
  const startX = (360 - totalW) / 2;

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 360 200" width="100%" style={{ maxWidth: 360 }}>
        {models.map((m2, i) => {
          const x = startX + i * (colW + colGap);
          return (
            <g key={i}>
              {/* Base layer */}
              <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>
                <rect x={x} y={130} width={colW} height={40} rx={6} fill="rgba(255,255,255,0.08)" stroke={BORDER} strokeWidth={1} />
                <text x={x + colW / 2} y={155} textAnchor="middle" fill={TEXT_DIM} fontSize={10} fontFamily="sans-serif">LLM Base</text>
              </m.g>
              {/* Personality layer */}
              <m.g
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.25, duration: 0.4 }}
              >
                <rect x={x} y={65} width={colW} height={58} rx={6} fill={`${m2.color}1A`} stroke={m2.color} strokeWidth={1} strokeOpacity={0.6} />
                <text x={x + colW / 2} y={85} textAnchor="middle" fill={m2.color} fontSize={12} fontWeight={600} fontFamily="sans-serif">{m2.name}</text>
                {m2.traits.map((t, j) => (
                  <text key={j} x={x + colW / 2} y={100 + j * 14} textAnchor="middle" fill={m2.color} fontSize={10} fontFamily="sans-serif" fillOpacity={0.7}>{t}</text>
                ))}
              </m.g>
            </g>
          );
        })}
      </svg>
    </GfxWrap>
  );
}

// ── choosing-by-task: Decision flowchart ──
function ByTask() {
  const branches = [
    { question: "מסמך ארוך?", tool: "Claude", color: PURPLE },
    { question: "צריך תמונה?", tool: "ChatGPT", color: TEAL },
    { question: "מידע עדכני?", tool: "Gemini", color: AMBER },
  ];
  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 360 220" width="100%" style={{ maxWidth: 360 }}>
        {/* Root node */}
        <m.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.3 }}>
          <rect x={130} y={10} width={100} height={32} rx={8} fill={CARD_BG} stroke={BORDER} strokeWidth={1} />
          <text x={180} y={31} textAnchor="middle" fill="white" fontSize={12} fontWeight={600} fontFamily="sans-serif">המשימה שלך</text>
        </m.g>
        {/* Branches */}
        {branches.map((b, i) => {
          const bx = 40 + i * 110;
          return (
            <m.g key={i}>
              {/* Line from root */}
              <m.line
                x1={180} y1={42} x2={bx + 45} y2={80}
                stroke={b.color} strokeWidth={1} strokeOpacity={0.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.5 + i * 0.3, duration: 0.3 }}
              />
              {/* Question */}
              <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.3, duration: 0.3 }}>
                <text x={bx + 45} y={95} textAnchor="middle" fill={TEXT_DIM} fontSize={10} fontFamily="sans-serif">{b.question}</text>
              </m.g>
              {/* Line to tool */}
              <m.line
                x1={bx + 45} y1={100} x2={bx + 45} y2={120}
                stroke={b.color} strokeWidth={1} strokeOpacity={0.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 1 + i * 0.3, duration: 0.2 }}
              />
              {/* Tool box */}
              <m.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 + i * 0.3, duration: 0.3 }}>
                <rect x={bx} y={125} width={90} height={32} rx={8} fill={`${b.color}1A`} stroke={b.color} strokeWidth={1.2} />
                <text x={bx + 45} y={146} textAnchor="middle" fill={b.color} fontSize={13} fontWeight={600} fontFamily="sans-serif">{b.tool}</text>
              </m.g>
            </m.g>
          );
        })}
      </svg>
    </GfxWrap>
  );
}

// ── choosing-strengths-weaknesses: Radar chart ──
function StrengthsWeaknesses() {
  const axes = ["הנמקה", "יצירתיות", "עדכניות", "הקשר", "כלים"];
  const cx = 170, cy = 110, maxR = 80;
  const models = [
    { name: "Claude", color: PURPLE, values: [0.9, 0.75, 0.4, 0.95, 0.5] },
    { name: "ChatGPT", color: TEAL, values: [0.7, 0.8, 0.6, 0.7, 0.95] },
    { name: "Gemini", color: AMBER, values: [0.65, 0.65, 0.95, 0.6, 0.7] },
  ];

  const getPoint = (axisIdx: number, value: number) => {
    const angle = (Math.PI * 2 * axisIdx) / axes.length - Math.PI / 2;
    return { x: cx + Math.cos(angle) * maxR * value, y: cy + Math.sin(angle) * maxR * value };
  };

  const getPolygonPath = (values: number[]) =>
    values.map((v, i) => {
      const p = getPoint(i, v);
      return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
    }).join(" ") + " Z";

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 340 250" width="100%" style={{ maxWidth: 340 }}>
        {/* Grid rings */}
        {[0.33, 0.66, 1].map((r, i) => (
          <polygon
            key={i}
            points={axes.map((_, j) => { const p = getPoint(j, r); return `${p.x},${p.y}`; }).join(" ")}
            fill="none" stroke={BORDER} strokeWidth={0.5}
          />
        ))}
        {/* Axis lines */}
        {axes.map((_, i) => {
          const p = getPoint(i, 1);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={BORDER} strokeWidth={0.5} />;
        })}
        {/* Axis labels */}
        {axes.map((label, i) => {
          const p = getPoint(i, 1.2);
          return (
            <text key={i} x={p.x} y={p.y + 4} textAnchor="middle" fill={TEXT_DIM} fontSize={10} fontFamily="sans-serif">
              {label}
            </text>
          );
        })}
        {/* Model polygons */}
        {models.map((model, i) => (
          <m.path
            key={i}
            d={getPolygonPath(model.values)}
            fill={model.color}
            fillOpacity={0.08}
            stroke={model.color}
            strokeWidth={1.5}
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 0.08 }}
            transition={{ delay: 0.3 + i * 0.4, duration: 0.6 }}
          />
        ))}
        {/* Legend */}
        {models.map((model, i) => (
          <g key={i}>
            <circle cx={100 + i * 60} cy={225} r={4} fill={model.color} />
            <text x={100 + i * 60 - 10} y={229} textAnchor="end" fill={TEXT} fontSize={10} fontFamily="sans-serif">{model.name}</text>
          </g>
        ))}
      </svg>
    </GfxWrap>
  );
}

// ── choosing-free-vs-paid: Comparison table ──
function FreeVsPaid() {
  const headers = ["Gemini", "ChatGPT", "Claude", ""];
  const rows = [
    { label: "מהירות", values: ["✓", "✓", "✓"], highlight: false },
    { label: "הקשר", values: ["1M", "128K", "200K"], highlight: false },
    { label: "תמונות", values: ["✓", "✓", "–"], highlight: false },
    { label: "גלישה", values: ["✓", "✓", "–"], highlight: false },
    { label: "מחיר (Pro)", values: ["$20", "$20", "$20"], highlight: true },
    { label: "מומלץ ל", values: ["מחקר", "כלים", "כתיבה"], highlight: true },
  ];

  return (
    <GfxWrap dir="rtl">
      <div style={{ width: "100%", maxWidth: 340, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "sans-serif" }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: i === 3 ? "right" : "center",
                  padding: "8px 6px",
                  borderBottom: `1px solid ${BORDER}`,
                  color: i === 0 ? AMBER : i === 1 ? TEAL : i === 2 ? PURPLE : TEXT_DIM,
                  fontWeight: 600,
                  fontSize: 12,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <m.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{
                  background: row.highlight ? `${PURPLE}0D` : "transparent",
                }}
              >
                {row.values.map((v, j) => (
                  <td key={j} style={{
                    textAlign: "center",
                    padding: "7px 6px",
                    borderBottom: `1px solid rgba(255,255,255,0.05)`,
                    color: v === "✓" ? GREEN : v === "–" ? TEXT_DIM : TEXT,
                  }}>
                    {v}
                  </td>
                ))}
                <td style={{
                  textAlign: "right",
                  padding: "7px 6px",
                  borderBottom: `1px solid rgba(255,255,255,0.05)`,
                  color: row.highlight ? "white" : TEXT_DIM,
                  fontWeight: row.highlight ? 500 : 400,
                }}>
                  {row.label}
                </td>
              </m.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GfxWrap>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COURSE: learning-with-ai
//
// Architecture: Option B — inline SVG via LessonGraphic (existing pattern).
// Font: var(--font-assistant) for consistent Hebrew rendering.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LAI_TEAL   = "#2DD4BF"; // Use app's TEAL
const LAI_AMBER  = "#F59E0B"; // Use app's AMBER
const LAI_CORAL  = "#F87171"; // Use app's CORAL
const LAI_WHITE  = "rgba(255, 255, 255, 0.95)";
const LAI_GRAY   = "rgba(255, 255, 255, 0.4)";
const LAI_DARK   = "rgba(255, 255, 255, 0.03)";
const LAI_FONT   = "var(--font-assistant), sans-serif";

// ── learning-ai-01: Two-column passive vs. active learning ──
function LearningAI01() {
  const rows = [
    { passive: "קריאה חוזרת",  active: "עונה על שאלות" },
    { passive: "סימון בצהוב",  active: "מתאים לרמה" },
    { passive: "האזנה פסיבית", active: "מתקן טעויות" },
  ];
  const colW = 145, rowH = 44, headerH = 48, gap = 10;
  const lx = 10, rx = lx + colW + gap;
  const tableY = 10;

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 320 220" width="100%" style={{ maxWidth: 400 }}>
        {/* Left header */}
        <m.rect x={lx} y={tableY} width={colW} height={headerH} rx={12}
          fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth={1}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} />
        <m.text x={lx + colW / 2} y={tableY + 28} textAnchor="middle"
          fill={TEXT_DIM} fontSize={13} fontWeight={500} fontFamily={LAI_FONT}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
          למידה פסיבית
        </m.text>

        {/* Right header */}
        <m.rect x={rx} y={tableY} width={colW} height={headerH} rx={12}
          fill={`${PURPLE}15`} stroke={PURPLE} strokeWidth={1.5}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} />
        <m.text x={rx + colW / 2} y={tableY + 28} textAnchor="middle"
          fill="white" fontSize={13} fontWeight={700} fontFamily={LAI_FONT}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
          למידה אקטיבית (AI)
        </m.text>

        {/* Data rows */}
        {rows.map((row, i) => {
          const y = tableY + headerH + 8 + i * (rowH + 8);
          return (
            <m.g key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}>
              {/* passive */}
              <rect x={lx} y={y} width={colW} height={rowH} rx={10}
                fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={lx + colW / 2} y={y + rowH / 2 + 5} textAnchor="middle"
                fill={TEXT_DIM} fontSize={12} fontFamily={LAI_FONT}>{row.passive}</text>
              
              {/* vs arrow */}
              <m.path d={`M${lx + colW + 2},${y + rowH / 2} L${rx - 2},${y + rowH / 2}`} 
                stroke={LAI_GRAY} strokeWidth={1} strokeDasharray="2 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.1 }} />

              {/* active */}
              <rect x={rx} y={y} width={colW} height={rowH} rx={10}
                fill={`${PURPLE}08`} stroke={`${PURPLE}44`} strokeWidth={1} />
              <text x={rx + colW / 2} y={y + rowH / 2 + 5} textAnchor="middle"
                fill="white" fontSize={12} fontWeight={600} fontFamily={LAI_FONT}>{row.active}</text>
            </m.g>
          );
        })}
      </svg>
    </GfxWrap>
  );
}

// ── learning-ai-02: Decision flowchart — Gemini learning paths ──
function LearningAI02() {
  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 320 230" width="100%" style={{ maxWidth: 360 }}>
        {/* Top node */}
        <m.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          <rect x={90} y={10} width={140} height={44} rx={12}
            fill="rgba(255,255,255,0.05)" stroke={PURPLE} strokeWidth={1.5} />
          <text x={160} y={37} textAnchor="middle"
            fill="white" fontSize={13} fontWeight={600} fontFamily={LAI_FONT}>
            מה המטרה שלך?
          </text>
        </m.g>

        {/* Branch lines */}
        <m.path d="M125,54 L75,100" stroke={LAI_GRAY} strokeWidth={1.5} strokeDasharray="4 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
        <m.path d="M195,54 L245,100" stroke={LAI_GRAY} strokeWidth={1.5} strokeDasharray="4 4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />

        {/* Mid nodes */}
        <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <text x={75} y={90} textAnchor="middle" fill={TEXT_DIM} fontSize={11} fontFamily={LAI_FONT}>להבין נושא</text>
          <rect x={15} y={105} width={120} height={40} rx={10} fill="rgba(255,255,255,0.03)" stroke={BORDER} strokeWidth={1} />
          <text x={75} y={130} textAnchor="middle" fill="white" fontSize={12} fontFamily={LAI_FONT}>למידה מודרכת</text>
        </m.g>
        <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <text x={245} y={90} textAnchor="middle" fill={TEXT_DIM} fontSize={11} fontFamily={LAI_FONT}>לצלול עמוק</text>
          <rect x={185} y={105} width={120} height={40} rx={10} fill="rgba(255,255,255,0.03)" stroke={BORDER} strokeWidth={1} />
          <text x={245} y={130} textAnchor="middle" fill="white" fontSize={12} fontFamily={LAI_FONT}>מחקר עמוק</text>
        </m.g>

        {/* Down arrows */}
        <m.line x1={75} y1={145} x2={75} y2={165} stroke={LAI_TEAL} strokeWidth={1.5} markerEnd="url(#arrowT)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.25 }} />
        <m.line x1={245} y1={145} x2={245} y2={165} stroke={LAI_AMBER} strokeWidth={1.5} markerEnd="url(#arrowA)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.0, duration: 0.25 }} />

        {/* Endpoints */}
        <m.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <rect x={15} y={170} width={120} height={44} rx={10} fill={`${LAI_TEAL}10`} stroke={LAI_TEAL} strokeWidth={1.5} />
          <text x={75} y={188} textAnchor="middle" fill={LAI_TEAL} fontSize={11} fontWeight={700} fontFamily={LAI_FONT}>Guided Learning</text>
          <text x={75} y={204} textAnchor="middle" fill={LAI_TEAL} fontSize={10} fontFamily={LAI_FONT} fillOpacity={0.6}>Gemini</text>
        </m.g>
        <m.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
          <rect x={185} y={170} width={120} height={44} rx={10} fill={`${LAI_AMBER}10`} stroke={LAI_AMBER} strokeWidth={1.5} />
          <text x={245} y={188} textAnchor="middle" fill={LAI_AMBER} fontSize={11} fontWeight={700} fontFamily={LAI_FONT}>Deep Research</text>
          <text x={245} y={204} textAnchor="middle" fill={LAI_AMBER} fontSize={10} fontFamily={LAI_FONT} fillOpacity={0.6}>Gemini</text>
        </m.g>
        
        <defs>
          <marker id="arrowT" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6" fill={LAI_TEAL} />
          </marker>
          <marker id="arrowA" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6" fill={LAI_AMBER} />
          </marker>
        </defs>
      </svg>
    </GfxWrap>
  );
}

// ── learning-ai-03: Circular 4-step Feynman cycle ──
function LearningAI03() {
  const cx = 160, cy = 120, r = 70;
  const steps = [
    { label: "בחר נושא",        color: PURPLE,    angle: -90 },
    { label: "הסבר בפשטות",     color: PURPLE,    angle:   0 },
    { label: "AI מוצא פערים",  color: LAI_AMBER, angle:  90 },
    { label: "חזור וחדד",       color: PURPLE,    angle: 180 },
  ];
  const nodeW = 104, nodeH = 36;

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 320 250" width="100%" style={{ maxWidth: 360 }}>
        {/* Arcs */}
        {steps.map((s, i) => {
          const next = steps[(i + 1) % 4];
          const a1 = (s.angle * Math.PI) / 180;
          const a2 = (next.angle * Math.PI) / 180;
          const x1 = cx + Math.cos(a1) * r;
          const y1 = cy + Math.sin(a1) * r;
          const x2 = cx + Math.cos(a2) * r;
          const y2 = cy + Math.sin(a2) * r;
          const midAngle = (a1 + a2) / 2;
          const mx = (x1 + x2) / 2 + Math.cos(midAngle + Math.PI / 2) * 20;
          const my = (y1 + y2) / 2 + Math.sin(midAngle + Math.PI / 2) * 20;
          return (
            <m.path key={`arc-${i}`}
              d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
              fill="none" stroke={LAI_GRAY} strokeWidth={1} strokeDasharray="3 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.5 }}
            />
          );
        })}

        {/* Nodes */}
        {steps.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          const nx = cx + Math.cos(rad) * r;
          const ny = cy + Math.sin(rad) * r;
          const isAmber = s.color === LAI_AMBER;
          return (
            <m.g key={i}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.3 }}>
              <rect x={nx - nodeW / 2} y={ny - nodeH / 2} width={nodeW} height={nodeH} rx={10}
                fill={isAmber ? `${LAI_AMBER}15` : "rgba(255,255,255,0.03)"}
                stroke={s.color} strokeWidth={isAmber ? 1.5 : 1} />
              <text x={nx} y={ny + 5} textAnchor="middle"
                fill={isAmber ? LAI_AMBER : "white"}
                fontSize={12} fontWeight={isAmber ? 700 : 500} fontFamily={LAI_FONT}>
                {s.label}
              </text>
              {/* Step number badge */}
              <circle cx={nx - nodeW/2} cy={ny - nodeH/2} r={8} fill={LAI_DARK} stroke={LAI_GRAY} strokeWidth={0.5} />
              <text x={nx - nodeW/2} y={ny - nodeH/2 + 3} textAnchor="middle" fill={LAI_GRAY} fontSize={9} fontFamily={LAI_FONT}>{i+1}</text>
            </m.g>
          );
        })}
      </svg>
    </GfxWrap>
  );
}

// ── learning-ai-04: Hub-and-spoke — NotebookLM output types ──
function LearningAI04() {
  const cx = 160, cy = 115;
  const outputs = [
    { label: "סקירה קולית",  sub: "Audio Overview",  color: LAI_TEAL,  angle: -135 },
    { label: "מדריך למידה",  sub: "Study Guide",     color: LAI_TEAL,  angle:  -45 },
    { label: "כרטיסיות",    sub: "Flashcards",      color: LAI_AMBER, angle:   45 },
    { label: "מבחן תרגול",   sub: "Mock Test",       color: LAI_AMBER, angle:  135 },
  ];
  const spokeLen = 85, nodeW = 100, nodeH = 46;

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 320 240" width="100%" style={{ maxWidth: 360 }}>
        {/* Spokes */}
        {outputs.map((o, i) => {
          const rad = (o.angle * Math.PI) / 180;
          return (
            <m.line key={`spoke-${i}`}
              x1={cx} y1={cy}
              x2={cx + Math.cos(rad) * (spokeLen - 10)} y2={cy + Math.sin(rad) * (spokeLen - 10)}
              stroke={o.color} strokeWidth={1} strokeOpacity={0.3} strokeDasharray="2 2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} />
          );
        })}

        {/* Center hub */}
        <m.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}>
          <circle cx={cx} cy={cy} r={38} fill="rgba(255,255,255,0.05)" stroke={PURPLE} strokeWidth={1.5} />
          <text x={cx} y={cy - 4} textAnchor="middle"
            fill="white" fontSize={11} fontWeight={700} fontFamily={LAI_FONT}>המסמך</text>
          <text x={cx} y={cy + 12} textAnchor="middle"
            fill={TEXT_DIM} fontSize={11} fontFamily={LAI_FONT}>שלך</text>
        </m.g>

        {/* Output nodes */}
        {outputs.map((o, i) => {
          const rad = (o.angle * Math.PI) / 180;
          const nx = cx + Math.cos(rad) * spokeLen;
          const ny = cy + Math.sin(rad) * spokeLen;
          return (
            <m.g key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.15 }}>
              <rect x={nx - nodeW / 2} y={ny - nodeH / 2} width={nodeW} height={nodeH} rx={12}
                fill={`${o.color}08`} stroke={o.color} strokeWidth={1} />
              <text x={nx} y={ny - 3} textAnchor="middle"
                fill="white" fontSize={12} fontWeight={600} fontFamily={LAI_FONT}>{o.label}</text>
              <text x={nx} y={ny + 12} textAnchor="middle"
                fill={o.color} fontSize={9} fontFamily={LAI_FONT} fillOpacity={0.8}>{o.sub}</text>
            </m.g>
          );
        })}
      </svg>
    </GfxWrap>
  );
}

// ── learning-ai-05: 4-node diagnostic loop ──
function LearningAI05() {
  const cx = 160, cy = 118, r = 70;
  const nodes = [
    { label: "טעית בשאלה",    color: LAI_CORAL, angle: -90 },
    { label: "AI מסביר למה", color: PURPLE,    angle:   0 },
    { label: "מזהה את הפער", color: PURPLE,    angle:  90 },
    { label: "מנסה שוב",      color: LAI_TEAL,  angle: 180 },
  ];
  const nodeW = 104, nodeH = 36;

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 320 242" width="100%" style={{ maxWidth: 360 }}>
        {/* Arcs */}
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % 4];
          const a1 = (n.angle * Math.PI) / 180;
          const a2 = (next.angle * Math.PI) / 180;
          const x1 = cx + Math.cos(a1) * r;
          const y1 = cy + Math.sin(a1) * r;
          const x2 = cx + Math.cos(a2) * r;
          const y2 = cy + Math.sin(a2) * r;
          const midAngle = (a1 + a2) / 2;
          const mx = (x1 + x2) / 2 + Math.cos(midAngle + Math.PI / 2) * 20;
          const my = (y1 + y2) / 2 + Math.sin(midAngle + Math.PI / 2) * 20;
          return (
            <m.path key={`arc-${i}`}
              d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
              fill="none" stroke={n.color} strokeWidth={1.5} strokeOpacity={0.4} strokeDasharray="3 3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.2 + i * 0.18, duration: 0.3 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          const nx = cx + Math.cos(rad) * r;
          const ny = cy + Math.sin(rad) * r;
          return (
            <m.g key={i}
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 + i * 0.16, duration: 0.3 }}>
              <rect x={nx - nodeW / 2} y={ny - nodeH / 2} width={nodeW} height={nodeH} rx={10}
                fill={`${n.color}10`} stroke={n.color} strokeWidth={1.5} />
              <text x={nx} y={ny + 5} textAnchor="middle"
                fill={i === 0 ? LAI_CORAL : i === 3 ? LAI_TEAL : "white"} 
                fontSize={12} fontWeight={600} fontFamily={LAI_FONT}>
                {n.label}
              </text>
            </m.g>
          );
        })}
      </svg>
    </GfxWrap>
  );
}

// ── learning-ai-06: Linear 3-question pre-reading workflow ──
function LearningAI06() {
  const bh = 48, y = 50;
  const bw = 85, gap = 12;
  const startX = 10;
  const questions = ["מה הטענה?", "מה הראיות?", "מה חסר?"];

  return (
    <GfxWrap dir="rtl">
      <svg viewBox="0 0 340 160" width="100%" style={{ maxWidth: 380 }}>
        {/* Sub-label */}
        <m.text x={170} y={30} textAnchor="middle"
          fill={TEXT_DIM} fontSize={11} fontFamily={LAI_FONT}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          בנה הקשר לפני שאתה מתחיל לקרוא
        </m.text>

        {/* 3 question boxes */}
        {questions.map((q, i) => {
          const x = startX + i * (bw + gap);
          return (
            <m.g key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}>
              <rect x={x} y={y} width={bw} height={bh} rx={12}
                fill="rgba(255,255,255,0.03)" stroke={PURPLE} strokeWidth={1} />
              <text x={x + bw / 2} y={y + 18} textAnchor="middle"
                fill={TEXT_DIM} fontSize={9} fontFamily={LAI_FONT}>שאל את עצמך:</text>
              <text x={x + bw / 2} y={y + 35} textAnchor="middle"
                fill="white" fontSize={11} fontWeight={600} fontFamily={LAI_FONT}>{q}</text>
              
              {/* connector arrow */}
              {i < 2 && (
                <m.path d={`M${x + bw + 2},${y + bh/2} L${x + bw + gap - 2},${y + bh/2}`}
                  stroke={LAI_GRAY} strokeWidth={1} strokeDasharray="2 2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 + i * 0.15 }} />
              )}
            </m.g>
          );
        })}

        {/* Final arrow (amber) */}
        <m.path d={`M${startX + 3 * bw + 2 * gap - 2},${y + bh/2} Q${315},${y + bh/2} ${315},${y + bh + 10}`}
          fill="none" stroke={LAI_AMBER} strokeWidth={1.5} strokeDasharray="3 3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.0 }} />

        {/* Final label */}
        <m.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }}>
          <rect x={265} y={115} width={70} height={30} rx={15}
            fill={`${LAI_AMBER}15`} stroke={LAI_AMBER} strokeWidth={1.5} />
          <text x={300} y={134} textAnchor="middle"
            fill={LAI_AMBER} fontSize={11} fontWeight={700} fontFamily={LAI_FONT}>עכשיו קרא</text>
        </m.g>
      </svg>
    </GfxWrap>
  );
}

// ── learning-ai-08: Forgetting curve — two-line graph ──
function LearningAI08() {
  const axisX = 50, axisY = 20, chartW = 210, chartH = 100;
  const bottomY = axisY + chartH;
  const rightX = axisX + chartW;

  const line1 = `M${axisX},${axisY + 10} C${axisX + 40},${axisY + 30} ${axisX + 70},${axisY + 95} ${rightX},${bottomY - 5}`;
  const line2 = `M${axisX},${axisY + 10} C${axisX + 80},${axisY + 20} ${axisX + 150},${axisY + 45} ${rightX},${axisY + 65}`;

  return (
    <GfxWrap dir="rtl">
      {/* Force direction LTR on SVG to avoid Hebrew character reversal/overlap in SVG coordinates */}
      <svg viewBox="0 0 320 180" width="100%" style={{ maxWidth: 400, direction: "ltr" }}>
        {/* Grid lines */}
        <line x1={axisX} y1={axisY + chartH/2} x2={rightX} y2={axisY + chartH/2} stroke={BORDER} strokeWidth={0.5} strokeDasharray="2 2" />

        {/* axes */}
        <m.line x1={axisX} y1={axisY - 10} x2={axisX} y2={bottomY + 5}
          stroke={LAI_GRAY} strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
        <m.line x1={axisX - 5} y1={bottomY} x2={rightX + 25} y2={bottomY}
          stroke={LAI_GRAY} strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />

        {/* labels - using middle/start/end anchors explicitly */}
        <text x={axisX - 10} y={axisY - 5} textAnchor="end" fill={TEXT_DIM} fontSize={10} fontFamily={LAI_FONT}>ריכוז</text>
        <text x={rightX + 15} y={bottomY + 16} textAnchor="middle" fill={TEXT_DIM} fontSize={10} fontFamily={LAI_FONT}>זמן</text>

        {/* curves */}
        <m.path d={line1} fill="none" stroke={LAI_CORAL} strokeWidth={3} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }} />
        <m.path d={line2} fill="none" stroke={LAI_TEAL} strokeWidth={3} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }} />

        {/* Legend - MOVED BELOW Graph and horizontal, using middle anchors to avoid reversal overlap */}
        <m.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          {/* Legend Coral - repositioned for no overlap */}
          <line x1={40} y1={160} x2={60} y2={160} stroke={LAI_CORAL} strokeWidth={3} strokeLinecap="round" />
          <text x={105} y={164} fill={TEXT} fontSize={11} fontFamily={LAI_FONT} textAnchor="middle">בלי פעולה</text>

          {/* Legend Teal - repositioned for no overlap */}
          <line x1={170} y1={160} x2={190} y2={160} stroke={LAI_TEAL} strokeWidth={3} strokeLinecap="round" />
          <text x={235} y={164} fill={TEXT} fontSize={11} fontFamily={LAI_FONT} textAnchor="middle">עם פעולה</text>
        </m.g>
      </svg>
    </GfxWrap>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const GRAPHIC_MAP: Record<string, React.FC> = {
  // how-llms-work
  "llms-what-is-llm": WhatIsLLM,
  "llms-how-model-thinks": HowModelThinks,
  "llms-temperature": TemperatureGraphic,
  // prompting-mastery
  "prompting-context-is-everything": ContextBlocks,
  "prompting-say-what-you-dont-want": SayWhatYouDontWant,
  "prompting-chain-of-thought": ChainOfThought,
  "prompting-iteration-loop": IterationLoop,
  "prompting-few-shot": FewShot,
  "prompting-format-control": FormatControl,
  "prompting-chaining-tasks": ChainingTasks,
  // choosing-models
  "choosing-what-are-llms-really": WhatAreLLMsReally,
  "choosing-by-task": ByTask,
  "choosing-strengths-weaknesses": StrengthsWeaknesses,
  "choosing-free-vs-paid": FreeVsPaid,
  // learning-with-ai (lesson 7 has no diagram — image will be wired via lesson.image)
  "learning-ai-01": LearningAI01,
  "learning-ai-02": LearningAI02,
  "learning-ai-03": LearningAI03,
  "learning-ai-04": LearningAI04,
  "learning-ai-05": LearningAI05,
  "learning-ai-06": LearningAI06,
  "learning-ai-08": LearningAI08,
};

interface LessonGraphicProps {
  lessonId: string;
}

export default function LessonGraphic({ lessonId }: LessonGraphicProps) {
  const Graphic = GRAPHIC_MAP[lessonId];
  if (!Graphic) return null;
  return <Graphic />;
}
