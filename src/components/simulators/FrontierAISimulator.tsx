import { useMemo, useState } from 'react';
import {
  computeMoERouting,
  evaluateTestTimeAccuracy,
  MOE_EXPERTS,
  MOE_PROMPT_TOKENS,
  type TaskDifficulty,
} from '../../utils/simulatorMath';
import { SimulatorFrame } from './SimulatorFrame';

const DIFFICULTY_OPTIONS: Array<{ id: TaskDifficulty; label: string }> = [
  { id: 'easy', label: '간단한 상식 질문' },
  { id: 'medium', label: '다단계 수학 추론' },
  { id: 'hard', label: '복잡한 코드 디버깅' },
];

export function FrontierAISimulator() {
  const [tab, setTab] = useState<'moe' | 'ttc'>('moe');

  // MoE state
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(1);
  const [topK, setTopK] = useState<1 | 2 | 8>(2);

  // Test-Time Compute state
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('hard');
  const [budgetTokens, setBudgetTokens] = useState(8192);

  const currentToken = MOE_PROMPT_TOKENS[selectedTokenIdx] ?? MOE_PROMPT_TOKENS[0];
  const routing = useMemo(
    () => computeMoERouting(currentToken.routerLogits, topK),
    [currentToken, topK],
  );

  const ttcMetrics = useMemo(
    () => evaluateTestTimeAccuracy(difficulty, budgetTokens),
    [difficulty, budgetTokens],
  );

  // Build SVG curve for Test-Time Compute comparison
  const SVG_W = 520;
  const SVG_H = 190;
  const PAD_L = 42;
  const PAD_R = 20;
  const PAD_T = 18;
  const PAD_B = 28;
  const MAX_BUDGET = 32768;

  const toX = (b: number) =>
    PAD_L + (b / MAX_BUDGET) * (SVG_W - PAD_L - PAD_R);
  const toY = (acc: number) =>
    SVG_H - PAD_B - ((acc - 20) / 80) * (SVG_H - PAD_T - PAD_B);

  const reasoningPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const b = (i / 40) * MAX_BUDGET;
      const m = evaluateTestTimeAccuracy(difficulty, b);
      pts.push(`${i === 0 ? 'M' : 'L'} ${toX(b).toFixed(1)} ${toY(m.reasoningAccuracy).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [difficulty]);

  const nonReasoningY = toY(ttcMetrics.nonReasoningAccuracy);
  const markerX = toX(budgetTokens);
  const markerY = toY(ttcMetrics.reasoningAccuracy);

  return (
    <SimulatorFrame
      figureLabel="Figure 6.1 · MoE Routing & Test-Time Compute"
      title="MoE 전문가 라우팅 & 추론 예산(Test-Time Compute) 비교"
      description="토큰마다 필요한 전문가만 켜는 희소 활성화(MoE)와, 어려운 문제에 사고 예산을 늘릴 때 정확도가 오르는 추론 스케일링을 비교해 보세요."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('moe')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === 'moe'
              ? 'bg-[var(--text-ink)] text-[var(--bg-paper)]'
              : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
          }`}
        >
          1. MoE 희소 전문가 라우팅
        </button>
        <button
          type="button"
          onClick={() => setTab('ttc')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === 'ttc'
              ? 'bg-[var(--text-ink)] text-[var(--bg-paper)]'
              : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
          }`}
        >
          2. 추론 예산 (Test-Time Compute)
        </button>
      </div>

      {tab === 'moe' ? (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {([1, 2, 8] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTopK(k)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    topK === k
                      ? 'bg-[var(--accent)] text-white'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
                  }`}
                >
                  {k === 8 ? 'Dense (8/8 전체)' : `MoE Top-${k} (${k}/8 활성)`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-[var(--teal-soft)] px-2.5 py-1 font-semibold text-[var(--teal)]">
                연산 절감 {routing.computeSavedPercent}%
              </span>
              <span className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-[var(--text-muted)]">
                활성 파라미터 {routing.activeRatioPercent}%
              </span>
            </div>
          </div>

          {/* Token selector */}
          <div className="mb-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/45 p-3">
            <div className="mb-2 text-[11px] font-medium text-[var(--text-muted)]">
              입력 프롬프트 토큰을 클릭해 라우터가 어떤 전문가를 깨우는지 확인하세요:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MOE_PROMPT_TOKENS.map((item, idx) => (
                <button
                  key={item.token}
                  type="button"
                  onClick={() => setSelectedTokenIdx(idx)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedTokenIdx === idx
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--accent)]'
                  }`}
                >
                  {item.token}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-[var(--text-muted)]">
              선택 토큰 역할: <strong className="text-[var(--text-ink)]">{currentToken.role}</strong>
            </div>
          </div>

          {/* 8 Experts Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {MOE_EXPERTS.map((expert) => {
              const weight = routing.weights[expert.id] ?? 0;
              const isActive = routing.selectedIds.includes(expert.id);
              const pct = Math.round(weight * 100);

              return (
                <div
                  key={expert.id}
                  className={`rounded-xl border p-3 transition-all ${
                    isActive
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 opacity-45'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-code font-semibold text-[var(--text-ink)]">
                      {expert.name}
                    </span>
                    <span
                      className={`font-mono-code text-[11px] font-semibold ${
                        isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {isActive ? `${pct}%` : '휴면'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-[var(--text-ink)]">
                    {expert.specialty}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDifficulty(opt.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  difficulty === opt.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 p-3">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="h-48 w-full" aria-label="추론 예산 대비 정확도 비교 그래프">
              <line x1={PAD_L} y1={SVG_H - PAD_B} x2={SVG_W - PAD_R} y2={SVG_H - PAD_B} stroke="var(--border-subtle)" />
              <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={SVG_H - PAD_B} stroke="var(--border-subtle)" />

              {/* Non-reasoning baseline */}
              <line
                x1={PAD_L}
                y1={nonReasoningY}
                x2={SVG_W - PAD_R}
                y2={nonReasoningY}
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              <text x={SVG_W - PAD_R} y={nonReasoningY - 6} textAnchor="end" fill="var(--text-muted)" fontSize="10">
                일반 즉답형 LLM ({ttcMetrics.nonReasoningAccuracy}%)
              </text>

              {/* Reasoning curve */}
              <path d={reasoningPath} fill="none" stroke="var(--accent)" strokeWidth="2.8" />

              {/* Current budget marker */}
              <line x1={markerX} y1={PAD_T} x2={markerX} y2={SVG_H - PAD_B} stroke="var(--accent)" strokeOpacity="0.3" strokeDasharray="3 3" />
              <circle cx={markerX} cy={markerY} r="6" fill="var(--accent)" stroke="var(--bg-elevated)" strokeWidth="2" />

              <text x={PAD_L - 6} y={PAD_T + 5} textAnchor="end" fill="var(--text-muted)" fontSize="9.5">100%</text>
              <text x={PAD_L - 6} y={SVG_H - PAD_B} textAnchor="end" fill="var(--text-muted)" fontSize="9.5">20%</text>
              <text x={SVG_W - PAD_R} y={SVG_H - 6} textAnchor="end" fill="var(--text-muted)" fontSize="9.5">
                Thinking Budget (토큰)
              </text>
            </svg>
          </div>

          <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 p-3.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[var(--text-ink)]">Thinking Budget (0-32,768 토큰)</span>
              <span className="font-mono-code font-semibold text-[var(--accent)]">
                {budgetTokens.toLocaleString()} 토큰
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={32768}
              step={512}
              value={budgetTokens}
              onChange={(e) => setBudgetTokens(Number(e.target.value))}
              aria-label="추론 예산 슬라이더"
              className="atlas-range mt-2 w-full"
            />
            <p className="mt-2 text-xs text-[var(--text-muted)]">{ttcMetrics.strategyNote}</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 px-3 py-2.5 text-center">
            <div>
              <div className="text-[11px] text-[var(--text-muted)]">추론 모델 정확도</div>
              <div className="font-mono-code text-sm font-semibold text-[var(--accent)]">
                {ttcMetrics.reasoningAccuracy}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)]">예상 응답 시간</div>
              <div className="font-mono-code text-sm font-semibold text-[var(--text-ink)]">
                {ttcMetrics.latencySeconds}초
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)]">상대 추론 비용</div>
              <div className="font-mono-code text-sm font-semibold text-[var(--text-ink)]">
                {ttcMetrics.relativeCost}x
              </div>
            </div>
          </div>
        </div>
      )}
    </SimulatorFrame>
  );
}
