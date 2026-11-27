import { BookOpen, Code2, FlaskConical, Sparkles } from 'lucide-react';
import type { DeepDiveContent, DepthMode } from '../types/atlas';
import { MathFormula } from './MathFormula';

interface DeepDiveBlockProps {
  deepDive: DeepDiveContent;
  depthMode: DepthMode;
  onEnableDeepMode: () => void;
}

export function DeepDiveBlock({
  deepDive,
  depthMode,
  onEnableDeepMode,
}: DeepDiveBlockProps) {
  if (depthMode === 'intuition') {
    return (
      <div className="mt-5 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] sm:text-sm">
            <FlaskConical className="h-4 w-4 shrink-0 text-[var(--accent)]" />
            <span>
              <strong className="font-medium text-[var(--text-ink)]">심화 노트:</strong>{' '}
              {deepDive.title} (핵심 수식 · 원문 논문 · 구현 포인트)
            </span>
          </div>
          <button
            type="button"
            onClick={onEnableDeepMode}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--accent)] transition-colors hover:border-[var(--accent)]"
          >
            <Sparkles className="h-3 w-3" />
            심화 모드로 펼치기
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label={`심화 노트: ${deepDive.title}`}
      className="mt-6 rounded-xl border border-[var(--border-subtle)] border-l-4 border-l-[var(--accent)] bg-[var(--bg-surface)] p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
          <FlaskConical className="h-3.5 w-3.5" />
          심화 모드
        </span>
        <h4 className="font-serif-editorial text-base font-semibold text-[var(--text-ink)] sm:text-lg">
          {deepDive.title}
        </h4>
      </div>

      {deepDive.formulas.length > 0 && (
        <div className="space-y-3">
          {deepDive.formulas.map((formula) => (
            <div
              key={formula.label}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3.5"
            >
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {formula.label}
              </div>
              <MathFormula latex={formula.latex} />
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
                {formula.explanation}
              </p>
            </div>
          ))}
        </div>
      )}

      {deepDive.papers.length > 0 && (
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
            <BookOpen className="h-3.5 w-3.5 text-[var(--teal)]" />
            <span>핵심 원문 논문</span>
          </div>
          {deepDive.papers.map((paper) => (
            <div
              key={paper.title}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3.5 py-2.5"
            >
              <div className="text-sm font-semibold text-[var(--text-ink)]">
                {paper.title}
              </div>
              <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                {paper.authors} · {paper.year}
                {paper.venue ? ` · ${paper.venue}` : ''}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-ink)]/90 sm:text-sm">
                {paper.takeaway}
              </p>
            </div>
          ))}
        </div>
      )}

      {deepDive.implementationPoints.length > 0 && (
        <div className="mt-4">
          <div className="mb-1.5 text-xs font-semibold text-[var(--text-muted)]">
            구현 및 실무 포인트
          </div>
          <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--text-ink)]/90 sm:text-sm">
            {deepDive.implementationPoints.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {deepDive.codeSnippet && (
        <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-paper)]">
          <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-muted)]">
            <Code2 className="h-3.5 w-3.5" />
            <span>{deepDive.codeSnippet.caption}</span>
          </div>
          <pre className="font-mono-code overflow-x-auto p-3 text-xs leading-relaxed text-[var(--text-ink)]">
            <code>{deepDive.codeSnippet.code}</code>
          </pre>
        </div>
      )}
    </aside>
  );
}
