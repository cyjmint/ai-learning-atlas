import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import {
  classifyGDState,
  evaluateGradient,
  evaluateLoss,
  stepGradientDescent,
  type GDStepPoint,
  type LossSurfaceType,
} from '../../utils/simulatorMath';
import { SimulatorFrame } from './SimulatorFrame';

const LR_PRESETS = [
  { label: '느린 수렴', lr: 0.08 },
  { label: '적정', lr: 0.35 },
  { label: '진동', lr: 1.85 },
  { label: '발산', lr: 2.25 },
];

const STATUS_BADGE = {
  ready: { label: '대기 중', className: 'bg-[var(--bg-surface)] text-[var(--text-muted)]' },
  stepping: { label: '탐색 중', className: 'bg-[var(--ochre-soft)] text-[var(--ochre)]' },
  converged: { label: '수렴 완료', className: 'bg-[var(--teal-soft)] text-[var(--teal)]' },
  oscillating: { label: '진동 중', className: 'bg-[var(--ochre-soft)] text-[var(--ochre)]' },
  diverged: { label: '발산!', className: 'bg-[var(--accent-soft)] text-[var(--accent)]' },
};

const W_MIN = -3.4;
const W_MAX = 3.4;
const L_MAX = 6.2;
const SVG_W = 560;
const SVG_H = 230;
const PAD_X = 34;
const PAD_Y = 20;

const toX = (w: number) =>
  PAD_X + ((w - W_MIN) / (W_MAX - W_MIN)) * (SVG_W - PAD_X * 2);

const toY = (loss: number) => {
  const clamped = Math.max(0, Math.min(L_MAX, loss));
  return SVG_H - PAD_Y - (clamped / L_MAX) * (SVG_H - PAD_Y * 2);
};

export function GradientDescentSimulator() {
  const [surface, setSurface] = useState<LossSurfaceType>('convex');
  const [lr, setLr] = useState(0.35);
  const [startW, setStartW] = useState(-2.6);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<GDStepPoint[]>(() => [
    {
      step: 0,
      w: -2.6,
      loss: evaluateLoss(-2.6, 'convex'),
      grad: evaluateGradient(-2.6, 'convex'),
    },
  ]);

  const status = useMemo(() => classifyGDState(history), [history]);
  const latest = history[history.length - 1];

  const resetHistory = (nextStartW = startW, nextSurface = surface) => {
    setIsRunning(false);
    setHistory([
      {
        step: 0,
        w: nextStartW,
        loss: evaluateLoss(nextStartW, nextSurface),
        grad: evaluateGradient(nextStartW, nextSurface),
      },
    ]);
  };

  const handleStep = () => {
    setHistory((prev) => {
      const current = prev[prev.length - 1];
      if (!Number.isFinite(current.w) || Math.abs(current.w) > 8) {
        return prev;
      }
      const { nextW, nextLoss } = stepGradientDescent(current.w, lr, surface);
      const nextGrad = evaluateGradient(nextW, surface);
      return [
        ...prev.slice(-29),
        {
          step: current.step + 1,
          w: nextW,
          loss: nextLoss,
          grad: nextGrad,
        },
      ];
    });
  };

  useEffect(() => {
    if (!isRunning) return;
    if (status === 'converged' || status === 'diverged') {
      setIsRunning(false);
      return;
    }
    const timer = window.setInterval(() => {
      handleStep();
    }, 360);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, lr, surface, status]);

  const curvePath = useMemo(() => {
    const points: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const w = W_MIN + (i / 120) * (W_MAX - W_MIN);
      const loss = evaluateLoss(w, surface);
      const x = toX(w).toFixed(1);
      const y = toY(loss).toFixed(1);
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ');
  }, [surface]);

  const badge = STATUS_BADGE[status];

  return (
    <SimulatorFrame
      figureLabel="Figure 2.1 · Gradient Descent & Learning Rate"
      title="경사하강법 & 학습률(Learning Rate) 체험"
      description="손실 곡면 위에서 학습률(η)을 조절하며 수렴, 진동, 발산이 어떻게 갈리는지 확인해 보세요."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSurface('convex');
              resetHistory(startW, 'convex');
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              surface === 'convex'
                ? 'bg-[var(--text-ink)] text-[var(--bg-paper)]'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
            }`}
          >
            볼록 곡면 (단일 최솟값)
          </button>
          <button
            type="button"
            onClick={() => {
              setSurface('nonconvex');
              resetHistory(startW, 'nonconvex');
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              surface === 'nonconvex'
                ? 'bg-[var(--text-ink)] text-[var(--bg-paper)]'
                : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
            }`}
          >
            비볼록 곡면 (지역 최솟값)
          </button>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>
          상태: {badge.label}
        </span>
      </div>

      {/* Main SVG loss curve */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 p-2">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="h-56 w-full" aria-label="손실 곡면과 경사하강법 궤적">
          <line x1={PAD_X} y1={SVG_H - PAD_Y} x2={SVG_W - PAD_X} y2={SVG_H - PAD_Y} stroke="var(--border-subtle)" strokeWidth="1.2" />
          <line x1={toX(0)} y1={PAD_Y} x2={toX(0)} y2={SVG_H - PAD_Y} stroke="var(--border-subtle)" strokeDasharray="3 3" />

          <path d={curvePath} fill="none" stroke="var(--text-muted)" strokeWidth="2.2" />

          {/* Trajectory hops */}
          {history.slice(1).map((pt, idx) => {
            const prev = history[idx];
            if (Math.abs(prev.w) > 3.5 || Math.abs(pt.w) > 3.5) return null;
            return (
              <line
                key={pt.step}
                x1={toX(prev.w)}
                y1={toY(prev.loss)}
                x2={toX(pt.w)}
                y2={toY(pt.loss)}
                stroke="var(--accent)"
                strokeWidth="1.6"
                strokeOpacity="0.6"
                strokeDasharray="3 2"
              />
            );
          })}

          {history.map((pt, idx) => {
            if (Math.abs(pt.w) > 3.5) return null;
            const isLatest = idx === history.length - 1;
            return (
              <circle
                key={pt.step}
                cx={toX(pt.w)}
                cy={toY(pt.loss)}
                r={isLatest ? 6.5 : 3.2}
                fill={isLatest ? 'var(--accent)' : 'var(--ochre)'}
                fillOpacity={isLatest ? 1 : 0.7}
                stroke={isLatest ? 'var(--bg-elevated)' : 'none'}
                strokeWidth={isLatest ? 2 : 0}
              />
            );
          })}

          <text x={SVG_W - PAD_X} y={SVG_H - 5} textAnchor="end" fill="var(--text-muted)" fontSize="10">
            가중치 w
          </text>
          <text x={PAD_X} y={14} fill="var(--text-muted)" fontSize="10">
            손실 L(w)
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[var(--text-ink)]">학습률 (η)</span>
            <span className="font-mono-code font-semibold text-[var(--accent)]">
              {lr.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.05}
            max={2.4}
            step={0.05}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            aria-label="학습률 슬라이더"
            className="atlas-range mt-2.5 w-full"
          />
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {LR_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setLr(preset.lr)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                  Math.abs(lr - preset.lr) < 0.02
                    ? 'bg-[var(--accent)] text-white'
                    : 'border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                }`}
              >
                {preset.label} ({preset.lr})
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[var(--text-ink)]">시작 위치 (w₀)</span>
            <span className="font-mono-code font-semibold text-[var(--text-ink)]">
              {startW.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={-3.0}
            max={3.0}
            step={0.2}
            value={startW}
            onChange={(e) => {
              const next = Number(e.target.value);
              setStartW(next);
              resetHistory(next, surface);
            }}
            aria-label="시작 위치 슬라이더"
            className="atlas-range mt-2.5 w-full"
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleStep}
              disabled={status === 'diverged'}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-ink)] transition-colors hover:border-[var(--accent)] disabled:opacity-45"
            >
              <StepForward className="h-3.5 w-3.5" />
              1스텝
            </button>
            <button
              type="button"
              onClick={() => setIsRunning((prev) => !prev)}
              disabled={status === 'diverged' || status === 'converged'}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-45"
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isRunning ? '일시정지' : '자동 실행'}
            </button>
            <button
              type="button"
              onClick={() => resetHistory(startW, surface)}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-ink)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* Live readout */}
      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 px-3.5 py-2.5 text-center">
        <div>
          <div className="text-[11px] text-[var(--text-muted)]">스텝</div>
          <div className="font-mono-code text-sm font-semibold text-[var(--text-ink)]">
            {latest.step}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[var(--text-muted)]">현재 손실 L(w)</div>
          <div className="font-mono-code text-sm font-semibold text-[var(--text-ink)]">
            {Number.isFinite(latest.loss) ? latest.loss.toFixed(3) : '∞'}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-[var(--text-muted)]">기울기 ∇L</div>
          <div className="font-mono-code text-sm font-semibold text-[var(--accent)]">
            {Number.isFinite(latest.grad) ? latest.grad.toFixed(3) : '∞'}
          </div>
        </div>
      </div>
    </SimulatorFrame>
  );
}
