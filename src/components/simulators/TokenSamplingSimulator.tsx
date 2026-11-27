import { useMemo, useState } from 'react';
import { Dices } from 'lucide-react';
import {
  computeSamplingDistribution,
  SAMPLING_PROMPTS,
  sampleFromDistribution,
} from '../../utils/simulatorMath';
import { SimulatorFrame } from './SimulatorFrame';

const SAMPLING_PRESETS = [
  { label: '정확·사실형 (T=0.2, p=0.6)', temp: 0.2, topP: 0.6 },
  { label: '균형형 (T=0.7, p=0.9)', temp: 0.7, topP: 0.9 },
  { label: '창작·발산형 (T=1.4, p=0.95)', temp: 1.4, topP: 0.95 },
];

export function TokenSamplingSimulator() {
  const [promptIdx, setPromptIdx] = useState(1);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [sampledHistory, setSampledHistory] = useState<string[]>([]);

  const currentPrompt = SAMPLING_PROMPTS[promptIdx] ?? SAMPLING_PROMPTS[0];

  const { entries, entropyBits, activeCount } = useMemo(
    () =>
      computeSamplingDistribution(currentPrompt.candidates, temperature, topP),
    [currentPrompt, temperature, topP],
  );

  const handleSample = () => {
    const picked = sampleFromDistribution(entries);
    setSampledHistory((prev) => [picked, ...prev.slice(0, 7)]);
  };

  return (
    <SimulatorFrame
      figureLabel="Figure 5.1 · Next-Token Sampling"
      title="다음 토큰 확률 & Temperature · Top-p 샘플링"
      description="Temperature(확률 분포의 뾰족함)와 Top-p(누적 확률 컷오프)를 조절해 생성 성향이 어떻게 달라지는지 체험해 보세요."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {SAMPLING_PROMPTS.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPromptIdx(idx);
                setSampledHistory([]);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                promptIdx === idx
                  ? 'bg-[var(--text-ink)] text-[var(--bg-paper)]'
                  : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-[var(--text-muted)]">
            활성 후보 <strong className="text-[var(--text-ink)]">{activeCount}</strong>/{entries.length}
          </span>
          <span className="rounded-full bg-[var(--teal-soft)] px-2.5 py-1 text-[var(--teal)]">
            엔트로피 {entropyBits.toFixed(2)} bits
          </span>
        </div>
      </div>

      {/* Prompt Preview */}
      <div className="mb-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 px-4 py-3 text-sm">
        <span className="text-xs font-medium text-[var(--text-muted)]">입력 문맥: </span>
        <span className="font-medium text-[var(--text-ink)]">&ldquo;{currentPrompt.prompt}&rdquo;</span>{' '}
        <span className="inline-block rounded-md border border-dashed border-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--accent)]">
          {sampledHistory[0] ? sampledHistory[0] : '[다음 토큰?]'}
        </span>
      </div>

      {/* Sliders */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[var(--text-ink)]">Temperature (0.1-2.0)</span>
            <span className="font-mono-code font-semibold text-[var(--accent)]">
              {temperature.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2.0}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            aria-label="Temperature 슬라이더"
            className="atlas-range mt-2 w-full"
          />
          <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
            낮을수록 1위 후보에 집중(보수적), 높을수록 하위 후보에도 기회를 줍니다.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 p-3.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[var(--text-ink)]">Top-p Nucleus (0.10-1.00)</span>
            <span className="font-mono-code font-semibold text-[var(--teal)]">
              {topP.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={topP}
            onChange={(e) => setTopP(Number(e.target.value))}
            aria-label="Top-p 슬라이더"
            className="atlas-range mt-2 w-full"
          />
          <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
            누적 확률이 p에 도달할 때까지만 후보에 남기고 나머지 꼬리는 제거합니다.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {SAMPLING_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setTemperature(preset.temp);
                setTopP(preset.topP);
              }}
              className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-ink)]"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSample}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Dices className="h-4 w-4" />
          다음 토큰 샘플링
        </button>
      </div>

      {/* Probability Bars */}
      <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/35 p-3.5">
        {entries.map((entry) => {
          const pct = Math.round(entry.finalProb * 1000) / 10;
          const rawPct = Math.round(entry.rawProb * 1000) / 10;
          return (
            <div
              key={entry.token}
              className={`flex items-center gap-2.5 text-xs ${
                entry.included ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span
                className={`w-20 truncate font-semibold ${
                  entry.included ? 'text-[var(--text-ink)]' : 'line-through text-[var(--text-muted)]'
                }`}
              >
                {entry.token}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                <div
                  className={`h-full rounded-full transition-all ${
                    entry.included ? 'bg-[var(--accent)]' : 'bg-[var(--text-muted)]'
                  }`}
                  style={{ width: `${entry.included ? pct : rawPct}%` }}
                />
              </div>
              <span className="font-mono-code w-16 text-right text-[var(--text-muted)]">
                {entry.included ? `${pct.toFixed(1)}%` : '제외됨'}
              </span>
            </div>
          );
        })}
      </div>

      {sampledHistory.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[var(--text-muted)]">최근 샘플링 결과:</span>
          {sampledHistory.map((tok, i) => (
            <span
              key={`${tok}-${i}`}
              className={`rounded-md px-2 py-0.5 font-medium ${
                i === 0
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
              }`}
            >
              {tok}
            </span>
          ))}
        </div>
      )}
    </SimulatorFrame>
  );
}
