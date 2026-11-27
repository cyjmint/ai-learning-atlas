import { useMemo, useState } from 'react';
import {
  CLUSTER_LABELS,
  EMBEDDING_WORDS,
  findNearestWords,
  vectorAnalogy,
  type WordCluster,
} from '../../utils/simulatorMath';
import { SimulatorFrame } from './SimulatorFrame';

const CLUSTER_COLORS: Record<WordCluster, string> = {
  royalty: 'var(--accent)',
  geography: 'var(--teal)',
  tech: 'var(--ochre)',
  fruit: '#6B7280',
};

const ANALOGY_PRESETS = [
  { label: '왕 - 남자 + 여자', a: 'king', b: 'man', c: 'woman' },
  { label: '서울 - 한국 + 일본', a: 'seoul', b: 'korea', c: 'japan' },
  { label: '파리 - 프랑스 + 한국', a: 'paris', b: 'france', c: 'korea' },
];

export function WordEmbeddingSimulator() {
  const [tab, setTab] = useState<'explore' | 'analogy'>('explore');
  const [selectedWordId, setSelectedWordId] = useState<string>('king');
  const [analogyA, setAnalogyA] = useState<string>('king');
  const [analogyB, setAnalogyB] = useState<string>('man');
  const [analogyC, setAnalogyC] = useState<string>('woman');

  const selectedWord =
    EMBEDDING_WORDS.find((w) => w.id === selectedWordId) ?? EMBEDDING_WORDS[0];

  const nearestWords = useMemo(
    () => findNearestWords(selectedWord.vec, [selectedWord.id], 5),
    [selectedWord],
  );

  const analogyResult = useMemo(
    () => vectorAnalogy(analogyA, analogyB, analogyC, 4),
    [analogyA, analogyB, analogyC],
  );

  const SVG_SIZE = 320;
  const toSvgX = (x: number) => SVG_SIZE / 2 + x * 125;
  const toSvgY = (y: number) => SVG_SIZE / 2 - y * 125;

  return (
    <SimulatorFrame
      figureLabel="Figure 3.1 · Word Embedding Space"
      title="단어 임베딩 벡터 공간 · 유사도 탐색"
      description="의미가 비슷한 단어들이 2D 투영 공간에 어떻게 군집을 이루는지 클릭해 보고, 벡터 덧셈·뺄셈 유추를 실험해 보세요."
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('explore')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === 'explore'
              ? 'bg-[var(--text-ink)] text-[var(--bg-paper)]'
              : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
          }`}
        >
          1. 벡터 공간 유사도 탐색
        </button>
        <button
          type="button"
          onClick={() => setTab('analogy')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === 'analogy'
              ? 'bg-[var(--text-ink)] text-[var(--bg-paper)]'
              : 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
          }`}
        >
          2. 벡터 유추 연산 (A - B + C)
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* 2D Vector Space Map */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 p-3">
          <svg
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="mx-auto h-64 w-full max-w-[300px]"
            aria-label="단어 임베딩 2D 벡터 공간"
          >
            <line x1="16" y1={SVG_SIZE / 2} x2={SVG_SIZE - 16} y2={SVG_SIZE / 2} stroke="var(--border-subtle)" strokeDasharray="3 3" />
            <line x1={SVG_SIZE / 2} y1="16" x2={SVG_SIZE / 2} y2={SVG_SIZE - 16} stroke="var(--border-subtle)" strokeDasharray="3 3" />

            {tab === 'analogy' && (
              <>
                <circle
                  cx={toSvgX(analogyResult.targetXY.x)}
                  cy={toSvgY(analogyResult.targetXY.y)}
                  r="9"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                {analogyResult.results[0] && (
                  <line
                    x1={toSvgX(analogyResult.targetXY.x)}
                    y1={toSvgY(analogyResult.targetXY.y)}
                    x2={toSvgX(analogyResult.results[0].word.x)}
                    y2={toSvgY(analogyResult.results[0].word.y)}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
              </>
            )}

            {EMBEDDING_WORDS.map((word) => {
              const cx = toSvgX(word.x);
              const cy = toSvgY(word.y);
              const isSelected = tab === 'explore' && word.id === selectedWord.id;
              const isAnalogyTop =
                tab === 'analogy' && analogyResult.results[0]?.word.id === word.id;
              const color = CLUSTER_COLORS[word.cluster];

              return (
                <g
                  key={word.id}
                  onClick={() => {
                    if (tab === 'explore') setSelectedWordId(word.id);
                  }}
                  className={tab === 'explore' ? 'cursor-pointer' : ''}
                >
                  {(isSelected || isAnalogyTop) && (
                    <circle cx={cx} cy={cy} r="10" fill={color} fillOpacity="0.2" />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected || isAnalogyTop ? 5.5 : 4}
                    fill={color}
                  />
                  <text
                    x={cx}
                    y={cy - 8}
                    textAnchor="middle"
                    fill="var(--text-ink)"
                    fontSize="10.5"
                    fontWeight={isSelected || isAnalogyTop ? '700' : '500'}
                  >
                    {word.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-2 flex flex-wrap justify-center gap-3 text-[11px] text-[var(--text-muted)]">
            {(Object.keys(CLUSTER_LABELS) as WordCluster[]).map((cluster) => (
              <span key={cluster} className="inline-flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: CLUSTER_COLORS[cluster] }}
                />
                {CLUSTER_LABELS[cluster]}
              </span>
            ))}
          </div>
        </div>

        {/* Right panel: Explore or Analogy */}
        {tab === 'explore' ? (
          <div className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  선택한 단어
                </span>
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                  {selectedWord.label}
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                좌측 공간에서 단어를 클릭하면 8차원 의미 벡터 기준 코사인 유사도가 가장 높은 단어들을 보여줍니다.
              </p>

              <div className="mt-4 space-y-2.5">
                {nearestWords.map(({ word, similarity }) => {
                  const pct = Math.max(0, Math.round(similarity * 100));
                  return (
                    <div key={word.id}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-[var(--text-ink)]">
                          {word.label}
                        </span>
                        <span className="font-mono-code text-[var(--text-muted)]">
                          {similarity.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]">
                        <div
                          className="h-full rounded-full bg-[var(--teal)] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--border-subtle)] pt-3">
              {EMBEDDING_WORDS.slice(0, 8).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWordId(w.id)}
                  className={`rounded-md px-2 py-1 text-[11px] font-medium ${
                    w.id === selectedWord.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 p-4">
            <div className="mb-2 text-xs font-semibold text-[var(--text-ink)]">
              추천 유추 프리셋
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ANALOGY_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setAnalogyA(preset.a);
                    setAnalogyB(preset.b);
                    setAnalogyC(preset.c);
                  }}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    analogyA === preset.a && analogyB === preset.b && analogyC === preset.c
                      ? 'bg-[var(--accent)] text-white'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <label className="text-[11px] text-[var(--text-muted)]">
                기준 (A)
                <select
                  value={analogyA}
                  onChange={(e) => setAnalogyA(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1 text-xs text-[var(--text-ink)]"
                >
                  {EMBEDDING_WORDS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] text-[var(--text-muted)]">
                빼기 (- B)
                <select
                  value={analogyB}
                  onChange={(e) => setAnalogyB(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1 text-xs text-[var(--text-ink)]"
                >
                  {EMBEDDING_WORDS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] text-[var(--text-muted)]">
                더하기 (+ C)
                <select
                  value={analogyC}
                  onChange={(e) => setAnalogyC(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2 py-1 text-xs text-[var(--text-ink)]"
                >
                  {EMBEDDING_WORDS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
              <div className="text-[11px] text-[var(--text-muted)]">가장 가까운 결과 단어</div>
              <div className="mt-2 space-y-2">
                {analogyResult.results.map((item, idx) => (
                  <div key={item.word.id} className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        idx === 0 ? 'text-[var(--accent)]' : 'text-[var(--text-ink)]'
                      }`}
                    >
                      {idx + 1}. {item.word.label}
                    </span>
                    <span className="font-mono-code text-[var(--text-muted)]">
                      유사도 {item.similarity.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SimulatorFrame>
  );
}
