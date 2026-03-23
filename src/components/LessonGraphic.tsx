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
};

interface LessonGraphicProps {
  lessonId: string;
}

export default function LessonGraphic({ lessonId }: LessonGraphicProps) {
  const Graphic = GRAPHIC_MAP[lessonId];
  if (!Graphic) return null;
  return <Graphic />;
}
