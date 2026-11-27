import type { DiagramId } from '../types/atlas';

interface ConceptDiagramProps {
  diagramId: DiagramId;
}

export function ConceptDiagram({ diagramId }: ConceptDiagramProps) {
  if (diagramId === 'math-intuition') {
    return (
      <figure className="my-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono-code text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
            Figure 0.1 · Core Math Intuition
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            유사도 · 변화율 · 가능성
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Panel 1: Vector Dot Product */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-3">
            <svg viewBox="0 0 180 120" className="h-28 w-full" aria-label="벡터와 내적 직관 도식">
              <line x1="25" y1="95" x2="155" y2="95" stroke="var(--border-subtle)" strokeWidth="1.5" />
              <line x1="25" y1="95" x2="25" y2="15" stroke="var(--border-subtle)" strokeWidth="1.5" />
              {/* Vector A */}
              <line x1="25" y1="95" x2="130" y2="40" stroke="var(--accent)" strokeWidth="2.8" strokeLinecap="round" />
              <circle cx="130" cy="40" r="3.5" fill="var(--accent)" />
              <text x="134" y="38" fill="var(--accent)" fontSize="11" fontWeight="600">왕</text>
              {/* Vector B */}
              <line x1="25" y1="95" x2="138" y2="62" stroke="var(--teal)" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="138" cy="62" r="3.5" fill="var(--teal)" />
              <text x="142" y="64" fill="var(--teal)" fontSize="11" fontWeight="600">여왕</text>
              {/* Angle arc */}
              <path d="M 65 74 A 42 42 0 0 1 68 83" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="72" y="79" fill="var(--text-muted)" fontSize="9.5">θ 작음</text>
            </svg>
            <div className="mt-1 text-center text-xs font-semibold text-[var(--text-ink)]">
              1. 벡터와 내적
            </div>
            <p className="mt-0.5 text-center text-[11px] leading-snug text-[var(--text-muted)]">
              같은 방향을 가리킬수록 유사도(내적)가 커집니다.
            </p>
          </div>

          {/* Panel 2: Gradient */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-3">
            <svg viewBox="0 0 180 120" className="h-28 w-full" aria-label="미분과 기울기 직관 도식">
              <path
                d="M 20 25 Q 90 135 160 25"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
              />
              <circle cx="48" cy="61" r="5" fill="var(--accent)" />
              <line x1="30" y1="40" x2="72" y2="88" stroke="var(--ochre)" strokeWidth="2" strokeDasharray="3 2" />
              <line x1="48" y1="61" x2="76" y2="83" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="90" cy="80" r="3" fill="var(--teal)" />
              <text x="90" y="99" textAnchor="middle" fill="var(--teal)" fontSize="10" fontWeight="600">최소 오차</text>
              <text x="58" y="47" fill="var(--accent)" fontSize="10" fontWeight="600">-기울기</text>
            </svg>
            <div className="mt-1 text-center text-xs font-semibold text-[var(--text-ink)]">
              2. 미분과 기울기
            </div>
            <p className="mt-0.5 text-center text-[11px] leading-snug text-[var(--text-muted)]">
              오차 곡면의 경사를 따라 가장 낮은 곳으로 내려갑니다.
            </p>
          </div>

          {/* Panel 3: Softmax Distribution */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-3">
            <svg viewBox="0 0 180 120" className="h-28 w-full" aria-label="확률분포 직관 도식">
              <rect x="28" y="24" width="26" height="68" rx="4" fill="var(--accent)" />
              <rect x="64" y="54" width="26" height="38" rx="4" fill="var(--teal)" fillOpacity="0.85" />
              <rect x="100" y="74" width="26" height="18" rx="4" fill="var(--ochre)" fillOpacity="0.8" />
              <rect x="136" y="84" width="26" height="8" rx="3" fill="var(--text-muted)" fillOpacity="0.45" />
              <text x="41" y="18" textAnchor="middle" fill="var(--text-ink)" fontSize="10" fontWeight="600">58%</text>
              <text x="77" y="48" textAnchor="middle" fill="var(--text-muted)" fontSize="10">26%</text>
              <text x="113" y="68" textAnchor="middle" fill="var(--text-muted)" fontSize="10">11%</text>
              <text x="149" y="78" textAnchor="middle" fill="var(--text-muted)" fontSize="10">5%</text>
              <line x1="20" y1="92" x2="168" y2="92" stroke="var(--border-subtle)" strokeWidth="1.5" />
              <text x="94" y="109" textAnchor="middle" fill="var(--text-muted)" fontSize="9.5">합계 = 100% (확률분포)</text>
            </svg>
            <div className="mt-1 text-center text-xs font-semibold text-[var(--text-ink)]">
              3. 확률분포
            </div>
            <p className="mt-0.5 text-center text-[11px] leading-snug text-[var(--text-muted)]">
              후보별 점수를 합계 1의 확률로 바꿔 선택합니다.
            </p>
          </div>
        </div>
      </figure>
    );
  }

  // symbolic-to-ml
  return (
    <figure className="my-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono-code text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
          Figure 1.1 · Symbolic AI vs Perceptron & XOR
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          직접 짠 규칙에서 선형 경계로
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-3.5">
          <div className="mb-2 text-xs font-semibold text-[var(--text-ink)]">
            기호주의: 인간이 직접 적는 IF-THEN 규칙
          </div>
          <svg viewBox="0 0 240 118" className="h-28 w-full" aria-label="기호주의 규칙 트리 도식">
            <rect x="65" y="8" width="110" height="24" rx="6" fill="var(--bg-elevated)" stroke="var(--border-subtle)" />
            <text x="120" y="24" textAnchor="middle" fill="var(--text-ink)" fontSize="10">수염이 있는가?</text>
            <line x1="95" y1="32" x2="60" y2="54" stroke="var(--text-muted)" strokeWidth="1.5" />
            <line x1="145" y1="32" x2="180" y2="54" stroke="var(--text-muted)" strokeWidth="1.5" />
            <rect x="15" y="54" width="90" height="24" rx="6" fill="var(--bg-elevated)" stroke="var(--border-subtle)" />
            <text x="60" y="70" textAnchor="middle" fill="var(--text-ink)" fontSize="10">귀가 뾰족한가?</text>
            <rect x="140" y="54" width="84" height="24" rx="6" fill="var(--bg-elevated)" stroke="var(--border-subtle)" />
            <text x="182" y="70" textAnchor="middle" fill="var(--text-muted)" fontSize="10">예외 조건...</text>
            <text x="120" y="102" textAnchor="middle" fill="var(--accent)" fontSize="10" fontWeight="600">
              현실의 예외가 늘수록 규칙이 폭발함
            </text>
          </svg>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-3.5">
          <div className="mb-2 text-xs font-semibold text-[var(--text-ink)]">
            단층 퍼셉트론: 직선 하나로 나눌 수 없는 XOR
          </div>
          <svg viewBox="0 0 240 118" className="h-28 w-full" aria-label="단층 퍼셉트론 XOR 한계 도식">
            <line x1="40" y1="92" x2="185" y2="92" stroke="var(--border-subtle)" strokeWidth="1.5" />
            <line x1="40" y1="92" x2="40" y2="14" stroke="var(--border-subtle)" strokeWidth="1.5" />
            {/* (0,0) and (1,1) = class A */}
            <circle cx="65" cy="74" r="7" fill="var(--teal)" />
            <circle cx="155" cy="28" r="7" fill="var(--teal)" />
            {/* (0,1) and (1,0) = class B */}
            <rect x="58" y="21" width="14" height="14" rx="3" fill="var(--accent)" />
            <rect x="148" y="67" width="14" height="14" rx="3" fill="var(--accent)" />
            {/* Impossible single line */}
            <line x1="45" y1="25" x2="175" y2="82" stroke="var(--ochre)" strokeWidth="2" strokeDasharray="4 3" />
            <text x="115" y="109" textAnchor="middle" fill="var(--accent)" fontSize="10" fontWeight="600">
              직선 1개로는 ●와 ■를 분리할 수 없음 → 다층 신경망 필요
            </text>
          </svg>
        </div>
      </div>
    </figure>
  );
}
