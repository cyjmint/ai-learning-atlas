import { ArrowRight, CheckCircle2, Circle, Compass, SlidersHorizontal } from 'lucide-react';
import type { StageData } from '../types/atlas';

interface RoadmapViewProps {
  stages: StageData[];
  completedStages: number[];
  lastVisitedStage: number | null;
  onSelectStage: (stageId: number) => void;
  onToggleComplete: (stageId: number) => void;
}

export function RoadmapView({
  stages,
  completedStages,
  lastVisitedStage,
  onSelectStage,
  onToggleComplete,
}: RoadmapViewProps) {
  const completedCount = completedStages.length;
  const totalCount = stages.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const recommendedNextStage =
    lastVisitedStage !== null
      ? lastVisitedStage
      : (stages.find((s) => !completedStages.includes(s.id))?.id ?? 0);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      {/* Editorial Hero */}
      <section className="border-b border-[var(--border-subtle)] pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
          <Compass className="h-3.5 w-3.5" />
          <span>인과관계 중심 AI 학습 지도 · 0-6단계</span>
        </div>

        <h1 className="font-serif-editorial mt-4 text-3xl font-bold tracking-tight text-[var(--text-ink)] sm:text-4xl">
          Frontier AI Atlas
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
          넘쳐나는 AI 자료 속에서 길을 잃지 않도록, AI의 출발점부터 현대 프론티어 AI의 작동 방식까지
          <br />
          <strong className="font-semibold text-[var(--text-ink)]">
            &ldquo;이전 기술의 한계 → 핵심 원리 → 다음 단계로의 필연적 연결&rdquo;
          </strong>
          이라는 단일 경로로 안내합니다.
        </p>

        {/* Progress Summary Card */}
        <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
              <span>전체 학습 진행률</span>
              <span className="font-mono-code font-semibold text-[var(--text-ink)]">
                {completedCount} / {totalCount} 단계 ({progressPercent}%)
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectStage(recommendedNextStage)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            <span>
              {lastVisitedStage !== null
                ? `${lastVisitedStage}단계 이어서 학습하기`
                : '0단계부터 시작하기'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Vertical Causal Timeline */}
      <section aria-label="전체 학습 로드맵" className="mt-10">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif-editorial text-xl font-semibold text-[var(--text-ink)] sm:text-2xl">
            학습 경로 (0단계 기초 + 6단계 본편)
          </h2>
          <span className="text-xs text-[var(--text-muted)]">
            원클릭으로 완료 체크 가능
          </span>
        </div>

        <div className="relative space-y-5 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-[var(--border-subtle)] sm:before:left-6">
          {stages.map((stage) => {
            const isCompleted = completedStages.includes(stage.id);
            const isCurrent = lastVisitedStage === stage.id;

            return (
              <article
                key={stage.id}
                className={`relative pl-12 sm:pl-14`}
              >
                {/* Node Circle */}
                <button
                  type="button"
                  onClick={() => onToggleComplete(stage.id)}
                  aria-label={`${stage.title} 완료 여부 전환`}
                  title={isCompleted ? '완료 해제' : '완료로 표시'}
                  className={`absolute left-1.5 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-colors sm:left-2.5 ${
                    isCompleted
                      ? 'border-[var(--teal)] bg-[var(--teal)] text-white'
                      : isCurrent
                        ? 'border-[var(--accent)] bg-[var(--bg-elevated)] text-[var(--accent)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-[var(--accent)]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Stage Card */}
                <div
                  className={`group rounded-2xl border bg-[var(--bg-elevated)] p-5 transition-all hover:border-[var(--accent)] hover:shadow-sm ${
                    isCurrent
                      ? 'border-[var(--accent)]/60 ring-1 ring-[var(--accent)]/20'
                      : 'border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-code rounded-md bg-[var(--bg-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--accent)]">
                        {stage.badge}
                      </span>
                      {isCurrent && (
                        <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
                          최근 학습
                        </span>
                      )}
                      {stage.simulatorId && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--teal-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--teal)]">
                          <SlidersHorizontal className="h-3 w-3" />
                          시뮬레이터 포함
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {stage.readingTime}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectStage(stage.id)}
                    className="mt-2.5 block w-full text-left focus:outline-none"
                  >
                    <h3 className="font-serif-editorial text-xl font-semibold text-[var(--text-ink)] transition-colors group-hover:text-[var(--accent)]">
                      {stage.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {stage.subtitle}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-ink)]/85">
                      {stage.summary}
                    </p>
                  </button>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {stage.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectStage(stage.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                    >
                      <span>학습하기</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
