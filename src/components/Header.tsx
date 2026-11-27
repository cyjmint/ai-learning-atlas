import { Compass, Download, Map, Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../types/atlas';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  theme: ThemeMode;
  isRoadmapView: boolean;
  onNavigateRoadmap: () => void;
  onToggleTheme: () => void;
  onOpenBackup: () => void;
}

export function Header({
  completedCount,
  totalCount,
  theme,
  isRoadmapView,
  onNavigateRoadmap,
  onToggleTheme,
  onOpenBackup,
}: HeaderProps) {
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header
      className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-paper)]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onNavigateRoadmap}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]">
            <Compass className="h-4.5 w-4.5" />
          </span>
          <div>
            <span className="font-serif-editorial block text-base font-semibold tracking-tight text-[var(--text-ink)] sm:text-lg">
              Frontier AI Atlas
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onNavigateRoadmap}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              isRoadmapView
                ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-ink)]'
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            <span>로드맵</span>
          </button>

          <div
            className="hidden items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 sm:flex"
            aria-label={`전체 진도율 ${completedCount}/${totalCount}`}
          >
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--border-subtle)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono-code text-xs font-medium text-[var(--text-muted)]">
              {completedCount}/{totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenBackup}
            title="진도 백업 및 복원"
            aria-label="진도 백업 및 복원"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors hover:border-[var(--text-muted)] hover:text-[var(--text-ink)]"
          >
            <Download className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors hover:border-[var(--text-muted)] hover:text-[var(--text-ink)]"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
