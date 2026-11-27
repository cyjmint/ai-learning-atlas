import { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  latex: string;
  displayMode?: boolean;
}

export function MathFormula({ latex, displayMode = true }: MathFormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return '';
    }
  }, [latex, displayMode]);

  if (!html) {
    return (
      <code className="font-mono-code block overflow-x-auto text-xs text-[var(--text-ink)]">
        {latex}
      </code>
    );
  }

  return (
    <div
      className="text-[var(--text-ink)]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
