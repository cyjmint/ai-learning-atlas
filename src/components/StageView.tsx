import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  FlaskConical,
  Lightbulb,
} from 'lucide-react';
import type { DepthMode, SimulatorId, StageData } from '../types/atlas';
import { ConceptDiagram } from './ConceptDiagram';
import { DeepDiveBlock } from './DeepDiveBlock';
import { ResourceList } from './ResourceList';
import { FrontierAISimulator } from './simulators/FrontierAISimulator';
import { GradientDescentSimulator } from './simulators/GradientDescentSimulator';
import { SelfAttentionSimulator } from './simulators/SelfAttentionSimulator';
import { TokenSamplingSimulator } from './simulators/TokenSamplingSimulator';
import { WordEmbeddingSimulator } from './simulators/WordEmbeddingSimulator';

interface StageViewProps {
  stage: StageData;
  prevStage?: StageData;
  nextStage?: StageData;
  isCompleted: boolean;
  depthMode: DepthMode;
  onSetDepthMode: (mode: DepthMode) => void;
  onToggleComplete: (stageId: number) => void;
  onNavigateRoadmap: () => void;
  onSelectStage: (stageId: number) => void;
}

function renderSimulator(simulatorId: SimulatorId) {
  switch (simulatorId) {
    case 'gradient-descent':
      return <GradientDescentSimulator />;
    case 'word-embedding':
      return <WordEmbeddingSimulator />;
    case 'self-attention':
      return <SelfAttentionSimulator />;
    case 'token-sampling':
      return <TokenSamplingSimulator />;
    case 'frontier-ai':
      return <FrontierAISimulator />;
  }
}

export function StageView({
  stage,
  prevStage,
  nextStage,
  isCompleted,
  depthMode,
  onSetDepthMode,
  onToggleComplete,
  onNavigateRoadmap,
  onSelectStage,
}: StageViewProps) {
  return (
    <main className="mx-auto max-w-[760px] px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
      {/* Top Breadcrumb + Depth Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <button
          type="button"
          onClick={onNavigateRoadmap}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>전체 로드맵으로</span>
        </button>

        {/* Intuition / Deep Mode Toggle */}
        <div
          role="group"
          aria-label="학습 깊이 모드 전환"
          className="inline-flex rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1"
        >
          <button
            type="button"
            onClick={() => onSetDepthMode('intuition')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              depthMode === 'intuition'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5 text-[var(--ochre)]" />
            직관 모드
          </button>
          <button
            type="button"
            onClick={() => onSetDepthMode('deep')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              depthMode === 'deep'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" />
            심화 모드
          </button>
        </div>
      </div>

      {/* Stage Header */}
      <header className="mt-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono-code rounded-md bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
            {stage.badge}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Clock className="h-3.5 w-3.5" />
            {stage.readingTime}
          </span>
        </div>

        <h1 className="font-serif-editorial mt-3 text-3xl font-bold tracking-tight text-[var(--text-ink)] sm:text-4xl">
          {stage.title}
        </h1>
        <p className="mt-2 text-base text-[var(--text-muted)] sm:text-lg">
          {stage.subtitle}
        </p>

        {/* Core Question Callout */}
        <blockquote className="mt-6 rounded-xl border border-[var(--border-subtle)] border-l-4 border-l-[var(--teal)] bg-[var(--bg-surface)]/70 px-5 py-4">
          <div className="font-mono-code text-[11px] font-semibold uppercase tracking-wider text-[var(--teal)]">
            Core Question
          </div>
          <p className="font-serif-editorial mt-1 text-base font-medium text-[var(--text-ink)] sm:text-lg">
            &ldquo;{stage.coreQuestion}&rdquo;
          </p>
        </blockquote>
      </header>

      {/* 3-Step Causal Narrative */}
      <article className="editorial-prose mt-10 space-y-12">
        {stage.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif-editorial text-2xl font-semibold text-[var(--text-ink)]">
              {section.heading}
            </h2>
            <p className="mt-2 text-base font-medium text-[var(--accent)]">
              {section.lead}
            </p>

            <div className="mt-4 space-y-4 text-[15.5px] text-[var(--text-ink)]/90 sm:text-base">
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {section.analogy && (
              <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ochre)]">
                  <Lightbulb className="h-4 w-4" />
                  <span>직관 비유: {section.analogy.title}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-ink)]/90">
                  {section.analogy.body}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            <ul className="mt-5 space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-sm">
              {section.keyPoints.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-[var(--text-ink)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--teal)]" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Embed Diagram or Interactive Simulator right after Mechanism section */}
            {section.kind === 'mechanism' && stage.diagramId && (
              <ConceptDiagram diagramId={stage.diagramId} />
            )}

            {section.kind === 'mechanism' && stage.simulatorId && (
              <div>
                {renderSimulator(stage.simulatorId)}
                {stage.simulatorCaption && (
                  <p className="-mt-4 mb-4 text-center text-xs text-[var(--text-muted)]">
                    {stage.simulatorCaption}
                  </p>
                )}
              </div>
            )}

            {/* Deep Dive Toggleable Content */}
            {section.deepDive && (
              <DeepDiveBlock
                deepDive={section.deepDive}
                depthMode={depthMode}
                onEnableDeepMode={() => onSetDepthMode('deep')}
              />
            )}
          </section>
        ))}
      </article>

      {/* Curated External Resources */}
      <ResourceList resources={stage.resources} />

      {/* Completion Toggle Banner */}
      <section className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-serif-editorial text-lg font-semibold text-[var(--text-ink)]">
              {isCompleted
                ? `${stage.badge} 학습을 완료했습니다!`
                : `${stage.badge} 학습을 마쳤나요?`}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--text-muted)] sm:text-sm">
              완료 체크를 누르면 진행률이 브라우저에 자동 저장됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleComplete(stage.id)}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              isCompleted
                ? 'bg-[var(--teal)] text-white hover:opacity-90'
                : 'border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            <span>{isCompleted ? '학습 완료됨' : '학습 완료로 표시'}</span>
          </button>
        </div>
      </section>

      {/* Prev / Next Navigation */}
      <nav
        aria-label="이전 및 다음 단계 이동"
        className="mt-6 grid gap-3 sm:grid-cols-2"
      >
        {prevStage ? (
          <button
            type="button"
            onClick={() => onSelectStage(prevStage.id)}
            className="flex flex-col items-start rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-left transition-colors hover:border-[var(--accent)]"
          >
            <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <ArrowLeft className="h-3.5 w-3.5" />
              이전 단계 ({prevStage.badge})
            </span>
            <span className="font-serif-editorial mt-1 text-base font-semibold text-[var(--text-ink)]">
              {prevStage.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextStage ? (
          <button
            type="button"
            onClick={() => onSelectStage(nextStage.id)}
            className="flex flex-col items-end rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-right transition-colors hover:border-[var(--accent)]"
          >
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
              다음 단계 ({nextStage.badge})
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="font-serif-editorial mt-1 text-base font-semibold text-[var(--text-ink)]">
              {nextStage.title}
            </span>
            {stage.nextBridgeTeaser && (
              <span className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)]">
                {stage.nextBridgeTeaser}
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNavigateRoadmap}
            className="flex flex-col items-end rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-right transition-colors hover:border-[var(--teal)]"
          >
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--teal)]">
              전체 여정 완주
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="font-serif-editorial mt-1 text-base font-semibold text-[var(--text-ink)]">
              전체 로드맵으로 돌아가기
            </span>
          </button>
        )}
      </nav>
    </main>
  );
}
