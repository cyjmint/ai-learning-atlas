import { useMemo, useState } from 'react';
import {
  ATTENTION_SENTENCES,
  computeAttentionRow,
} from '../../utils/simulatorMath';
import { SimulatorFrame } from './SimulatorFrame';

export function SelfAttentionSimulator() {
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [headIdx, setHeadIdx] = useState(0);
  const [queryIdx, setQueryIdx] = useState(4);
  const [causalMask, setCausalMask] = useState(false);

  const sentence = ATTENTION_SENTENCES[sentenceIdx] ?? ATTENTION_SENTENCES[0];
  const head = sentence.heads[headIdx] ?? sentence.heads[0];
  const safeQueryIdx = Math.min(queryIdx, sentence.tokens.length - 1);

  const weights = useMemo(
    () => computeAttentionRow(head.scores[safeQueryIdx], safeQueryIdx, causalMask),
    [head, safeQueryIdx, causalMask],
  );

  const SVG_W = 560;
  const SVG_H = 120;
  const tokenCount = sentence.tokens.length;
  const getTokenX = (idx: number) =>
    ((idx + 0.5) / tokenCount) * (SVG_W - 40) + 20;

  return (
    <SimulatorFrame
      figureLabel="Figure 4.1 · Self-Attention Explorer"
      title="Self-Attention 가중치 탐색기"
      description="문장 내 Query 토큰을 클릭하면, 다른 Key 토큰들에게 부여되는 어텐션 가중치를 실시간으로 시각화합니다."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {ATTENTION_SENTENCES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSentenceIdx(idx);
                setHeadIdx(0);
                setQueryIdx(idx === 0 ? 4 : 2);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                sentenceIdx === idx
                  ? 'bg-[var(--text-ink)] text-[var(--bg-paper)]'
                  : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-ink)]">
          <input
            type="checkbox"
            checked={causalMask}
            onChange={(e) => setCausalMask(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          Causal Mask (미래 토큰 가리기)
        </label>
      </div>

      {/* Head selector */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {sentence.heads.map((h, idx) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setHeadIdx(idx)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              headIdx === idx
                ? 'bg-[var(--accent-soft)] text-[var(--accent)] ring-1 ring-[var(--accent)]/40'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 text-[var(--text-muted)]'
            }`}
          >
            {h.name}
          </button>
        ))}
        <span className="text-xs text-[var(--text-muted)]">{head.description}</span>
      </div>

      {/* Attention Arcs + Token Row */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/45 p-3">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="h-24 w-full" aria-label="Self-Attention 연결 아크">
          {sentence.tokens.map((token, keyIdx) => {
            const w = weights[keyIdx] ?? 0;
            if (w < 0.01) return null;
            const x1 = getTokenX(safeQueryIdx);
            const x2 = getTokenX(keyIdx);
            const midX = (x1 + x2) / 2;
            const dist = Math.abs(x2 - x1);
            const arcY = Math.max(12, SVG_H - 18 - dist * 0.28);

            return (
              <path
                key={`${token}-${keyIdx}`}
                d={`M ${x1} ${SVG_H - 8} Q ${midX} ${arcY} ${x2} ${SVG_H - 8}`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1 + w * 6.5}
                strokeOpacity={Math.min(0.95, 0.18 + w * 1.4)}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        <div className="grid grid-cols-7 gap-1.5">
          {sentence.tokens.map((token, idx) => {
            const isQuery = idx === safeQueryIdx;
            const isMasked = causalMask && idx > safeQueryIdx;
            const weight = weights[idx] ?? 0;

            return (
              <button
                key={`${token}-${idx}`}
                type="button"
                onClick={() => setQueryIdx(idx)}
                className={`rounded-lg border px-1.5 py-2 text-center transition-all ${
                  isQuery
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-xs'
                    : isMasked
                      ? 'border-dashed border-[var(--border-subtle)] bg-[var(--bg-paper)] text-[var(--text-muted)]/50'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--accent)]'
                }`}
                style={
                  !isQuery && !isMasked
                    ? {
                        boxShadow: `inset 0 -3px 0 rgba(194, 89, 62, ${Math.min(0.85, weight * 1.4)})`,
                      }
                    : undefined
                }
              >
                <div className="truncate text-xs font-semibold sm:text-sm">{token}</div>
                <div
                  className={`font-mono-code mt-0.5 text-[10px] ${
                    isQuery ? 'text-white/90' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {isMasked ? 'MASK' : `${Math.round(weight * 100)}%`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weight distribution bar breakdown */}
      <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 p-3.5">
        <div className="mb-2.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--text-ink)]">
            Query: &ldquo;{sentence.tokens[safeQueryIdx]}&rdquo; 의 어텐션 가중치 분포
          </span>
          <span className="font-mono-code text-[var(--text-muted)]">합계 = 100%</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {sentence.tokens.map((token, idx) => {
            const w = weights[idx] ?? 0;
            const pct = Math.round(w * 100);
            const isMasked = causalMask && idx > safeQueryIdx;
            return (
              <div key={`bar-${token}-${idx}`} className="flex items-center gap-2 text-xs">
                <span className="w-16 truncate font-medium text-[var(--text-ink)]">{token}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="font-mono-code w-10 text-right text-[var(--text-muted)]">
                  {isMasked ? '0%' : `${pct}%`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </SimulatorFrame>
  );
}
