// Pure mathematical engines for the 5 interactive simulators

// ============================================================================
// 1. Gradient Descent Simulator (Stage 2)
// ============================================================================

export type LossSurfaceType = 'convex' | 'nonconvex';
export type GDStatus = 'ready' | 'converged' | 'oscillating' | 'diverged' | 'stepping';

export interface GDStepPoint {
  step: number;
  w: number;
  loss: number;
  grad: number;
}

export function evaluateLoss(w: number, surface: LossSurfaceType): number {
  if (surface === 'convex') {
    return 0.5 * w * w;
  }
  // Double-well asymmetric curve with a local minimum near w ≈ -1.66 and global minimum near w ≈ 1.81
  return 0.14 * Math.pow(w, 4) - 0.85 * w * w + 0.25 * w + 2.0;
}

export function evaluateGradient(w: number, surface: LossSurfaceType): number {
  if (surface === 'convex') {
    return w;
  }
  return 0.56 * Math.pow(w, 3) - 1.7 * w + 0.25;
}

export function stepGradientDescent(
  w: number,
  lr: number,
  surface: LossSurfaceType,
): { nextW: number; loss: number; grad: number; nextLoss: number } {
  const grad = evaluateGradient(w, surface);
  const loss = evaluateLoss(w, surface);
  const nextW = w - lr * grad;
  const nextLoss = evaluateLoss(nextW, surface);
  return { nextW, loss, grad, nextLoss };
}

export function classifyGDState(history: GDStepPoint[]): GDStatus {
  if (history.length <= 1) return 'ready';
  const latest = history[history.length - 1];

  if (!Number.isFinite(latest.w) || !Number.isFinite(latest.loss) || Math.abs(latest.w) > 8) {
    return 'diverged';
  }

  if (Math.abs(latest.grad) < 0.03) {
    return 'converged';
  }

  if (history.length >= 4) {
    const recent = history.slice(-4);
    const diffs = [
      recent[1].w - recent[0].w,
      recent[2].w - recent[1].w,
      recent[3].w - recent[2].w,
    ];
    const alternating =
      diffs[0] * diffs[1] < 0 && diffs[1] * diffs[2] < 0;
    if (alternating) {
      return 'oscillating';
    }
  }

  return 'stepping';
}

// ============================================================================
// 2. Word Embedding Simulator (Stage 3)
// ============================================================================

export type WordCluster = 'royalty' | 'geography' | 'tech' | 'fruit';

export interface EmbeddingWord {
  id: string;
  label: string;
  cluster: WordCluster;
  // 2D projection coordinates in [-1, 1]
  x: number;
  y: number;
  // 8D semantic vector: [royalty, gender(+female/-male), youth, geography, europe, asia, tech, food]
  vec: number[];
}

export const CLUSTER_LABELS: Record<WordCluster, string> = {
  royalty: '왕실·인물',
  geography: '국가·수도',
  tech: '기술·AI',
  fruit: '과일·음식',
};

export const EMBEDDING_WORDS: EmbeddingWord[] = [
  // Royalty & People
  { id: 'king', label: '왕', cluster: 'royalty', x: -0.68, y: 0.62, vec: [1.0, -0.9, -0.4, 0, 0, 0, 0, 0] },
  { id: 'queen', label: '여왕', cluster: 'royalty', x: -0.42, y: 0.78, vec: [1.0, 0.9, -0.4, 0, 0, 0, 0, 0] },
  { id: 'prince', label: '왕자', cluster: 'royalty', x: -0.78, y: 0.36, vec: [0.9, -0.9, 0.8, 0, 0, 0, 0, 0] },
  { id: 'princess', label: '공주', cluster: 'royalty', x: -0.52, y: 0.52, vec: [0.9, 0.9, 0.8, 0, 0, 0, 0, 0] },
  { id: 'man', label: '남자', cluster: 'royalty', x: -0.62, y: 0.14, vec: [0.0, -0.9, 0.0, 0, 0, 0, 0, 0] },
  { id: 'woman', label: '여자', cluster: 'royalty', x: -0.36, y: 0.30, vec: [0.0, 0.9, 0.0, 0, 0, 0, 0, 0] },

  // Geography (Capitals & Countries)
  { id: 'seoul', label: '서울', cluster: 'geography', x: 0.52, y: 0.72, vec: [0, 0, 0, 1.0, -0.2, 1.0, 0, 0] },
  { id: 'korea', label: '한국', cluster: 'geography', x: 0.32, y: 0.48, vec: [0, 0, 0, 0.1, -0.2, 1.0, 0, 0] },
  { id: 'tokyo', label: '도쿄', cluster: 'geography', x: 0.76, y: 0.58, vec: [0, 0, 0, 1.0, -0.4, 0.85, 0, 0] },
  { id: 'japan', label: '일본', cluster: 'geography', x: 0.56, y: 0.34, vec: [0, 0, 0, 0.1, -0.4, 0.85, 0, 0] },
  { id: 'paris', label: '파리', cluster: 'geography', x: 0.44, y: 0.88, vec: [0, 0, 0, 1.0, 1.0, -0.3, 0, 0] },
  { id: 'france', label: '프랑스', cluster: 'geography', x: 0.24, y: 0.64, vec: [0, 0, 0, 0.1, 1.0, -0.3, 0, 0] },

  // Technology & AI
  { id: 'ai', label: 'AI', cluster: 'tech', x: 0.46, y: -0.48, vec: [0, 0, 0, 0, 0, 0, 1.0, 0] },
  { id: 'neuralnet', label: '신경망', cluster: 'tech', x: 0.66, y: -0.62, vec: [0, 0, 0, 0, 0, 0, 0.95, 0] },
  { id: 'algorithm', label: '알고리즘', cluster: 'tech', x: 0.36, y: -0.74, vec: [0, 0, 0, 0, 0, 0, 0.88, 0] },
  { id: 'data', label: '데이터', cluster: 'tech', x: 0.68, y: -0.32, vec: [0, 0, 0, 0, 0, 0, 0.82, 0] },

  // Fruits
  { id: 'apple', label: '사과', cluster: 'fruit', x: -0.52, y: -0.56, vec: [0, 0, 0, 0, 0, 0, 0, 1.0] },
  { id: 'banana', label: '바나나', cluster: 'fruit', x: -0.32, y: -0.72, vec: [0, 0, 0, 0, 0, 0, 0, 0.95] },
];

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

export function findNearestWords(
  targetVec: number[],
  excludeIds: string[] = [],
  topK = 5,
): Array<{ word: EmbeddingWord; similarity: number }> {
  return EMBEDDING_WORDS.filter((w) => !excludeIds.includes(w.id))
    .map((word) => ({
      word,
      similarity: cosineSimilarity(targetVec, word.vec),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

export function vectorAnalogy(
  aId: string,
  bId: string,
  cId: string,
  topK = 4,
): {
  targetVec: number[];
  targetXY: { x: number; y: number };
  results: Array<{ word: EmbeddingWord; similarity: number }>;
} {
  const a = EMBEDDING_WORDS.find((w) => w.id === aId) ?? EMBEDDING_WORDS[0];
  const b = EMBEDDING_WORDS.find((w) => w.id === bId) ?? EMBEDDING_WORDS[4];
  const c = EMBEDDING_WORDS.find((w) => w.id === cId) ?? EMBEDDING_WORDS[5];

  const targetVec = a.vec.map((v, idx) => v - b.vec[idx] + c.vec[idx]);
  const targetXY = {
    x: a.x - b.x + c.x,
    y: a.y - b.y + c.y,
  };

  const results = findNearestWords(targetVec, [a.id, b.id, c.id], topK);
  return { targetVec, targetXY, results };
}

// ============================================================================
// 3. Self-Attention Simulator (Stage 4)
// ============================================================================

export interface AttentionSentence {
  id: string;
  label: string;
  tokens: string[];
  heads: Array<{
    id: string;
    name: string;
    description: string;
    // Raw Q*K / sqrt(d_k) score matrix: scores[queryIdx][keyIdx]
    scores: number[][];
  }>;
}

export const ATTENTION_SENTENCES: AttentionSentence[] = [
  {
    id: 'pronoun',
    label: '대명사 지시 해소',
    tokens: ['고양이가', '매트', '위에', '앉았다.', '그것은', '매우', '졸렸다.'],
    heads: [
      {
        id: 'coref',
        name: 'Head 1 · 지시 대상 연결',
        description: '"그것은"이 가리키는 주체("고양이가")를 문맥에서 찾아 연결합니다.',
        scores: [
          [2.4, 0.3, 0.2, 0.1, 0.4, 0.1, 0.2],
          [0.4, 2.2, 1.3, 0.3, 0.2, 0.1, 0.1],
          [0.3, 1.7, 1.9, 0.5, 0.1, 0.1, 0.1],
          [1.2, 1.0, 0.8, 1.5, 0.2, 0.1, 0.1],
          [3.6, 0.7, 0.1, 0.2, 1.4, 0.2, 0.3],
          [0.4, 0.2, 0.1, 0.1, 1.1, 1.8, 1.5],
          [2.1, 0.2, 0.1, 0.3, 2.4, 1.4, 1.9],
        ],
      },
      {
        id: 'syntax',
        name: 'Head 2 · 인접 구문 결합',
        description: '서로 인접해 문법적 짝을 이루는 토큰(명사+조사, 부사+형용사)에 집중합니다.',
        scores: [
          [2.0, 0.8, 0.2, 0.6, 0.2, 0.1, 0.1],
          [0.6, 1.8, 2.5, 0.4, 0.1, 0.1, 0.1],
          [0.2, 2.4, 1.6, 1.3, 0.1, 0.1, 0.1],
          [1.4, 0.8, 1.2, 1.8, 0.4, 0.1, 0.2],
          [0.8, 0.2, 0.1, 0.7, 1.9, 1.0, 0.9],
          [0.1, 0.1, 0.1, 0.1, 0.7, 1.8, 2.7],
          [0.6, 0.1, 0.1, 0.4, 1.2, 2.5, 1.9],
        ],
      },
    ],
  },
  {
    id: 'polysemy',
    label: '다의어 문맥 해소',
    tokens: ['나는', '달콤한', '사과를', '먹고', '친구에게', '진심으로', '사과했다.'],
    heads: [
      {
        id: 'semantic',
        name: 'Head 1 · 의미 문맥 결합',
        description: '앞쪽 "사과를"은 "달콤한/먹고"에, 뒤쪽 "사과했다"는 "친구에게/진심으로"에 집중합니다.',
        scores: [
          [2.1, 0.2, 0.7, 0.9, 0.4, 0.2, 0.8],
          [0.2, 2.0, 2.5, 0.6, 0.1, 0.1, 0.1],
          [0.4, 2.7, 1.8, 2.3, 0.1, 0.1, 0.1],
          [1.0, 0.8, 2.6, 1.7, 0.2, 0.1, 0.2],
          [0.8, 0.1, 0.1, 0.2, 2.1, 1.1, 1.9],
          [0.3, 0.1, 0.1, 0.1, 1.2, 1.9, 2.6],
          [1.1, 0.1, 0.1, 0.3, 2.5, 2.7, 1.6],
        ],
      },
      {
        id: 'action',
        name: 'Head 2 · 주어-서술어 정렬',
        description: '행동의 주체인 "나는"과 두 개의 서술어("먹고", "사과했다")를 연결합니다.',
        scores: [
          [2.3, 0.2, 0.4, 1.4, 0.3, 0.2, 1.6],
          [0.4, 1.9, 2.0, 0.5, 0.1, 0.1, 0.1],
          [0.9, 1.5, 1.8, 1.7, 0.1, 0.1, 0.1],
          [2.4, 0.4, 1.9, 1.6, 0.2, 0.1, 0.4],
          [1.1, 0.1, 0.1, 0.3, 2.0, 0.7, 1.6],
          [0.6, 0.1, 0.1, 0.2, 1.1, 1.8, 2.2],
          [2.6, 0.1, 0.1, 0.6, 1.8, 1.5, 1.4],
        ],
      },
    ],
  },
];

export function softmax(values: number[]): number[] {
  if (values.length === 0) return [];
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) {
    return values.map(() => 0);
  }
  const maxVal = Math.max(...finiteValues);
  const exps = values.map((v) => (Number.isFinite(v) ? Math.exp(v - maxVal) : 0));
  const sum = exps.reduce((acc, v) => acc + v, 0);
  if (sum === 0) return values.map(() => 0);
  return exps.map((e) => e / sum);
}

export function computeAttentionRow(
  scoresRow: number[],
  queryIdx: number,
  causalMask: boolean,
): number[] {
  const masked = scoresRow.map((score, keyIdx) =>
    causalMask && keyIdx > queryIdx ? -Infinity : score,
  );
  return softmax(masked);
}

export function computeAttentionMatrix(
  scores: number[][],
  causalMask: boolean,
): number[][] {
  return scores.map((row, queryIdx) =>
    computeAttentionRow(row, queryIdx, causalMask),
  );
}

// ============================================================================
// 4. Token Sampling Simulator (Stage 5)
// ============================================================================

export interface SamplingPrompt {
  id: string;
  label: string;
  prompt: string;
  candidates: Array<{ token: string; logit: number }>;
}

export const SAMPLING_PROMPTS: SamplingPrompt[] = [
  {
    id: 'factual',
    label: '사실 기반 완성',
    prompt: '대한민국의 수도는',
    candidates: [
      { token: '서울', logit: 7.4 },
      { token: '서울특별시', logit: 5.3 },
      { token: '부산', logit: 2.1 },
      { token: '인천', logit: 1.5 },
      { token: '한양', logit: 1.2 },
      { token: '경주', logit: 0.7 },
      { token: '대전', logit: 0.4 },
      { token: '평양', logit: 0.1 },
    ],
  },
  {
    id: 'creative',
    label: '창작 문장 이어쓰기',
    prompt: '비 오는 밤, 창밖을 바라보던 로봇은 조용히',
    candidates: [
      { token: '한숨을', logit: 4.5 },
      { token: '미소를', logit: 4.1 },
      { token: '메모를', logit: 3.7 },
      { token: '불을', logit: 3.3 },
      { token: '노래를', logit: 2.9 },
      { token: '기억을', logit: 2.5 },
      { token: '빗방울을', logit: 2.1 },
      { token: '전원을', logit: 1.8 },
    ],
  },
  {
    id: 'code',
    label: '코드·기술 문맥',
    prompt: '트랜스포머 모델이 긴 문맥을 기억하려면',
    candidates: [
      { token: 'KV', logit: 5.2 },
      { token: '어텐션', logit: 4.7 },
      { token: '메모리', logit: 3.9 },
      { token: '위치', logit: 3.2 },
      { token: '토큰', logit: 2.5 },
      { token: '캐시', logit: 2.2 },
      { token: '연산', logit: 1.6 },
      { token: '압축', logit: 1.1 },
    ],
  },
];

export interface TokenProbabilityEntry {
  token: string;
  logit: number;
  rawProb: number;
  cumulativeProb: number;
  included: boolean;
  finalProb: number;
}

export function computeSamplingDistribution(
  candidates: Array<{ token: string; logit: number }>,
  temperature: number,
  topP: number,
): { entries: TokenProbabilityEntry[]; entropyBits: number; activeCount: number } {
  const safeTemp = Math.max(0.05, temperature);
  const safeTopP = Math.min(1, Math.max(0.05, topP));

  const scaled = candidates.map((c) => c.logit / safeTemp);
  const probs = softmax(scaled);

  const sorted = candidates
    .map((c, idx) => ({
      token: c.token,
      logit: c.logit,
      rawProb: probs[idx],
    }))
    .sort((a, b) => b.rawProb - a.rawProb);

  let cumulative = 0;
  let cutoffReached = false;
  const withNucleus = sorted.map((item, idx) => {
    const prevCumulative = cumulative;
    cumulative += item.rawProb;
    // Always keep at least the top-1 token, then keep while previous cumulative < topP
    const included = idx === 0 || (!cutoffReached && prevCumulative < safeTopP);
    if (cumulative >= safeTopP) {
      cutoffReached = true;
    }
    return {
      ...item,
      cumulativeProb: cumulative,
      included,
    };
  });

  const includedSum = withNucleus
    .filter((e) => e.included)
    .reduce((acc, e) => acc + e.rawProb, 0);

  const entries: TokenProbabilityEntry[] = withNucleus.map((e) => ({
    ...e,
    finalProb: e.included && includedSum > 0 ? e.rawProb / includedSum : 0,
  }));

  const entropyBits = entries.reduce((acc, e) => {
    if (e.finalProb <= 0) return acc;
    return acc - e.finalProb * Math.log2(e.finalProb);
  }, 0);

  const activeCount = entries.filter((e) => e.included).length;

  return { entries, entropyBits, activeCount };
}

export function sampleFromDistribution(
  entries: TokenProbabilityEntry[],
  rand = Math.random(),
): string {
  const active = entries.filter((e) => e.finalProb > 0);
  if (active.length === 0) return entries[0]?.token ?? '';
  let acc = 0;
  for (const item of active) {
    acc += item.finalProb;
    if (rand <= acc) return item.token;
  }
  return active[active.length - 1].token;
}

// ============================================================================
// 5. Frontier AI Simulator: MoE Routing & Test-Time Compute (Stage 6)
// ============================================================================

export interface MoEExpert {
  id: number;
  name: string;
  specialty: string;
}

export const MOE_EXPERTS: MoEExpert[] = [
  { id: 0, name: 'Expert 1', specialty: '구문·조사' },
  { id: 1, name: 'Expert 2', specialty: '수학·수식' },
  { id: 2, name: 'Expert 3', specialty: '코드·로직' },
  { id: 3, name: 'Expert 4', specialty: '한국어 문맥' },
  { id: 4, name: 'Expert 5', specialty: '사실·지식' },
  { id: 5, name: 'Expert 6', specialty: '요약·구조' },
  { id: 6, name: 'Expert 7', specialty: '논리 추론' },
  { id: 7, name: 'Expert 8', specialty: '일반 표현' },
];

export interface MoETokenInput {
  token: string;
  role: string;
  routerLogits: number[]; // length 8
}

export const MOE_PROMPT_TOKENS: MoETokenInput[] = [
  { token: '파이썬으로', role: '언어/도메인 지정', routerLogits: [0.4, 0.2, 3.6, 2.3, 0.5, 0.1, 0.4, 0.3] },
  { token: '피보나치', role: '수학/알고리즘 개념', routerLogits: [0.2, 3.5, 2.9, 0.3, 1.4, 0.1, 1.1, 0.2] },
  { token: '함수를', role: '구문/코드 명사', routerLogits: [2.6, 0.3, 3.1, 0.8, 0.2, 0.4, 0.2, 0.5] },
  { token: '작성하고', role: '한국어 서술어', routerLogits: [2.9, 0.1, 0.7, 3.3, 0.2, 0.8, 0.3, 1.1] },
  { token: '시간복잡도를', role: '추론/분석 대상', routerLogits: [0.4, 2.8, 2.4, 0.5, 0.7, 0.3, 3.4, 0.2] },
  { token: '설명해줘.', role: '요약/출력 지시', routerLogits: [1.1, 0.2, 0.3, 2.1, 0.6, 3.5, 0.8, 2.7] },
];

export function computeMoERouting(
  routerLogits: number[],
  topK: 1 | 2 | 8,
): {
  weights: number[];
  selectedIds: number[];
  activeRatioPercent: number;
  computeSavedPercent: number;
} {
  const fullProbs = softmax(routerLogits);
  const ranked = fullProbs
    .map((prob, id) => ({ id, prob }))
    .sort((a, b) => b.prob - a.prob);

  const selected = ranked.slice(0, topK);
  const selectedIds = selected.map((s) => s.id);
  const selectedSum = selected.reduce((acc, s) => acc + s.prob, 0);

  const weights = MOE_EXPERTS.map((_, id) => {
    const found = selected.find((s) => s.id === id);
    if (!found || selectedSum === 0) return 0;
    return found.prob / selectedSum;
  });

  const activeRatioPercent = Math.round((topK / MOE_EXPERTS.length) * 100);
  const computeSavedPercent = 100 - activeRatioPercent;

  return {
    weights,
    selectedIds,
    activeRatioPercent,
    computeSavedPercent,
  };
}

export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export interface TestTimeMetrics {
  reasoningAccuracy: number;
  nonReasoningAccuracy: number;
  latencySeconds: number;
  relativeCost: number;
  strategyNote: string;
}

export function evaluateTestTimeAccuracy(
  difficulty: TaskDifficulty,
  budgetTokens: number,
): TestTimeMetrics {
  const clampedBudget = Math.max(0, Math.min(32768, budgetTokens));
  const logProgress = Math.log2(1 + clampedBudget / 512) / Math.log2(1 + 32768 / 512);

  if (difficulty === 'easy') {
    const nonReasoningAccuracy = 91;
    const reasoningAccuracy = Math.round(90 + 6 * Math.pow(logProgress, 0.6));
    return {
      reasoningAccuracy,
      nonReasoningAccuracy,
      latencySeconds: Number((0.6 + (clampedBudget / 32768) * 6.5).toFixed(1)),
      relativeCost: Number((1 + clampedBudget / 2048).toFixed(1)),
      strategyNote:
        clampedBudget > 4096
          ? '간단한 질문에는 긴 사고가 정확도를 거의 올리지 못하고 지연 시간만 늘어납니다.'
          : '짧은 직관 응답만으로도 이미 높은 정확도에 도달합니다.',
    };
  }

  if (difficulty === 'medium') {
    const nonReasoningAccuracy = 62;
    const reasoningAccuracy = Math.round(62 + 29 * Math.pow(logProgress, 0.78));
    return {
      reasoningAccuracy,
      nonReasoningAccuracy,
      latencySeconds: Number((0.9 + (clampedBudget / 32768) * 14).toFixed(1)),
      relativeCost: Number((1 + clampedBudget / 1536).toFixed(1)),
      strategyNote:
        clampedBudget < 2048
          ? '중간 단계 검증 없이 바로 답을 내면 계산 실수가 발생하기 쉽습니다.'
          : '단계별 검증과 중간 점검이 더해지며 정확도가 빠르게 상승합니다.',
    };
  }

  const nonReasoningAccuracy = 34;
  const reasoningAccuracy = Math.round(34 + 54 * Math.pow(logProgress, 0.85));
  return {
    reasoningAccuracy,
    nonReasoningAccuracy,
    latencySeconds: Number((1.2 + (clampedBudget / 32768) * 28).toFixed(1)),
    relativeCost: Number((1 + clampedBudget / 1024).toFixed(1)),
    strategyNote:
      clampedBudget < 4096
        ? '고난도 추론·디버깅은 첫 직관에 의존하면 함정에 빠지기 쉽습니다.'
        : '가설 수립 → 반례 탐색 → 자기 교정 루프를 돌며 정답률이 극적으로 개선됩니다.',
  };
}
