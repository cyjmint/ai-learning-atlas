import { describe, expect, it } from 'vitest';
import { CURRICULUM_STAGES, TOTAL_STAGE_COUNT } from '../data/curriculum';

describe('curriculum data integrity', () => {
  it('contains stages 0 through 6 in order', () => {
    expect(TOTAL_STAGE_COUNT).toBe(7);
    expect(CURRICULUM_STAGES.map((s) => s.id)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('has 3-step causal structure and deepDive content in every stage', () => {
    for (const stage of CURRICULUM_STAGES) {
      expect(stage.sections).toHaveLength(3);
      expect(stage.sections[0].kind).toBe('limitation');
      expect(stage.sections[1].kind).toBe('mechanism');
      expect(stage.sections[2].kind).toBe('bridge');
      for (const sec of stage.sections) {
        expect(sec.deepDive).toBeDefined();
        expect(sec.deepDive?.formulas.length).toBeGreaterThan(0);
      }
    }
  });

  it('maps the 5 interactive simulators to stages 2 through 6', () => {
    expect(CURRICULUM_STAGES[2].simulatorId).toBe('gradient-descent');
    expect(CURRICULUM_STAGES[3].simulatorId).toBe('word-embedding');
    expect(CURRICULUM_STAGES[4].simulatorId).toBe('self-attention');
    expect(CURRICULUM_STAGES[5].simulatorId).toBe('token-sampling');
    expect(CURRICULUM_STAGES[6].simulatorId).toBe('frontier-ai');
  });

  it('includes 2-4 curated resources with complete metadata per stage', () => {
    for (const stage of CURRICULUM_STAGES) {
      expect(stage.resources.length).toBeGreaterThanOrEqual(2);
      expect(stage.resources.length).toBeLessThanOrEqual(4);
      for (const res of stage.resources) {
        expect(res.url.startsWith('http')).toBe(true);
        expect(res.language.length).toBeGreaterThan(0);
        expect(res.subtitleInfo.length).toBeGreaterThan(0);
        expect(res.difficulty.length).toBeGreaterThan(0);
        expect(res.duration.length).toBeGreaterThan(0);
      }
    }
  });

  it('does not use half-width tilde (~) for Korean ranges in curriculum text', () => {
    const serialized = JSON.stringify(CURRICULUM_STAGES);
    expect(serialized).not.toContain('~');
  });
});
