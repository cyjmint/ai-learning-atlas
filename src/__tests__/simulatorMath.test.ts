import { describe, expect, it } from 'vitest';
import {
  ATTENTION_SENTENCES,
  classifyGDState,
  computeAttentionRow,
  computeMoERouting,
  computeSamplingDistribution,
  evaluateGradient,
  evaluateLoss,
  evaluateTestTimeAccuracy,
  MOE_PROMPT_TOKENS,
  SAMPLING_PROMPTS,
  stepGradientDescent,
  vectorAnalogy,
} from '../utils/simulatorMath';

describe('simulatorMath pure engines', () => {
  it('converges on convex surface with reasonable lr and diverges on huge lr', () => {
    let w = -2.5;
    const goodHistory = [
      { step: 0, w, loss: evaluateLoss(w, 'convex'), grad: evaluateGradient(w, 'convex') },
    ];
    for (let i = 1; i <= 20; i++) {
      const res = stepGradientDescent(w, 0.35, 'convex');
      w = res.nextW;
      goodHistory.push({
        step: i,
        w,
        loss: res.nextLoss,
        grad: evaluateGradient(w, 'convex'),
      });
    }
    expect(classifyGDState(goodHistory)).toBe('converged');

    let badW = -2.5;
    const badHistory = [
      { step: 0, w: badW, loss: evaluateLoss(badW, 'convex'), grad: evaluateGradient(badW, 'convex') },
    ];
    for (let i = 1; i <= 10; i++) {
      const res = stepGradientDescent(badW, 2.3, 'convex');
      badW = res.nextW;
      badHistory.push({
        step: i,
        w: badW,
        loss: res.nextLoss,
        grad: evaluateGradient(badW, 'convex'),
      });
    }
    expect(classifyGDState(badHistory)).toBe('diverged');
  });

  it('computes accurate word embedding analogies', () => {
    const royalty = vectorAnalogy('king', 'man', 'woman');
    expect(royalty.results[0]?.word.id).toBe('queen');

    const capital = vectorAnalogy('seoul', 'korea', 'japan');
    expect(capital.results[0]?.word.id).toBe('tokyo');
  });

  it('normalizes self-attention weights and enforces causal mask', () => {
    const scoresRow = ATTENTION_SENTENCES[0].heads[0].scores[2];
    const unmasked = computeAttentionRow(scoresRow, 2, false);
    const sumUnmasked = unmasked.reduce((a, b) => a + b, 0);
    expect(sumUnmasked).toBeCloseTo(1, 5);
    expect(unmasked[4]).toBeGreaterThan(0);

    const masked = computeAttentionRow(scoresRow, 2, true);
    const sumMasked = masked.reduce((a, b) => a + b, 0);
    expect(sumMasked).toBeCloseTo(1, 5);
    expect(masked[3]).toBe(0);
    expect(masked[6]).toBe(0);
  });

  it('filters token sampling with temperature and top-p nucleus', () => {
    const candidates = SAMPLING_PROMPTS[1].candidates;
    const lowTemp = computeSamplingDistribution(candidates, 0.15, 0.6);
    const highTemp = computeSamplingDistribution(candidates, 1.5, 1.0);

    const lowSum = lowTemp.entries.reduce((a, e) => a + e.finalProb, 0);
    expect(lowSum).toBeCloseTo(1, 5);
    expect(lowTemp.entropyBits).toBeLessThan(highTemp.entropyBits);
    expect(lowTemp.activeCount).toBeLessThanOrEqual(highTemp.activeCount);
  });

  it('computes MoE sparse routing and monotonic test-time compute gains', () => {
    const moe = computeMoERouting(MOE_PROMPT_TOKENS[1].routerLogits, 2);
    expect(moe.selectedIds).toHaveLength(2);
    expect(moe.computeSavedPercent).toBe(75);
    const weightSum = moe.weights.reduce((a, b) => a + b, 0);
    expect(weightSum).toBeCloseTo(1, 5);

    const lowBudget = evaluateTestTimeAccuracy('hard', 0);
    const highBudget = evaluateTestTimeAccuracy('hard', 32768);
    expect(highBudget.reasoningAccuracy).toBeGreaterThan(lowBudget.reasoningAccuracy);
  });
});
