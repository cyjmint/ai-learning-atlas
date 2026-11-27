import { Clock, ExternalLink, Globe, Layers, Subtitles } from 'lucide-react';
import type { ResourceItem } from '../types/atlas';

interface ResourceListProps {
  resources: ResourceItem[];
}

const DIFFICULTY_STYLES: Record<ResourceItem['difficulty'], string> = {
  입문: 'bg-[var(--teal-soft)] text-[var(--teal)]',
  중급: 'bg-[var(--ochre-soft)] text-[var(--ochre)]',
  심화: 'bg-[var(--accent-soft)] text-[var(--accent)]',
};

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <section aria-labelledby="resources-heading" className="mt-12 border-t border-[var(--border-subtle)] pt-8">
      <div className="mb-5">
        <span className="font-mono-code text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
          Curated References
        </span>
        <h3
          id="resources-heading"
          className="font-serif-editorial mt-1 text-xl font-semibold text-[var(--text-ink)] sm:text-2xl"
        >
          엄선된 외부 자료 ({resources.length}선)
        </h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          대체 불가능한 글로벌 정석 자료만 추렸습니다. 언어, 자막, 난이도와 예상 소요시간을 보고 선택해 보세요.
        </p>
      </div>

      <div className="space-y-3.5">
        {resources.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-[var(--text-ink)] transition-colors group-hover:text-[var(--accent)]">
                  {item.title}
                </h4>
                <div className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">
                  {item.author}
                </div>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]" />
            </div>

            <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-ink)]/85">
              {item.note}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-0.5 font-medium text-[var(--text-ink)]">
                <Globe className="h-3 w-3 text-[var(--text-muted)]" />
                {item.language}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-0.5 text-[var(--text-muted)]">
                <Subtitles className="h-3 w-3" />
                {item.subtitleInfo}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium ${DIFFICULTY_STYLES[item.difficulty]}`}
              >
                <Layers className="h-3 w-3" />
                {item.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-0.5 text-[var(--text-muted)]">
                <Clock className="h-3 w-3" />
                {item.duration}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
