import type { ReactNode } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface SimulatorFrameProps {
  figureLabel: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function SimulatorFrame({
  figureLabel,
  title,
  description,
  children,
}: SimulatorFrameProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 px-5 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono-code inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {figureLabel}
          </span>
          <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
            인터랙티브 시뮬레이터
          </span>
        </div>
        <h4 className="font-serif-editorial mt-1.5 text-lg font-semibold text-[var(--text-ink)] sm:text-xl">
          {title}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
          {description}
        </p>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  );
}
