import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_PROGRESS_STATE,
  loadProgressState,
  parseAndValidateBackup,
  saveProgressState,
  serializeBackup,
  STORAGE_KEY,
} from '../utils/storage';

describe('storage & backup utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads default state when localStorage is empty or corrupted', () => {
    const initial = loadProgressState();
    expect(initial.completedStages).toEqual([]);
    expect(initial.depthMode).toBe('intuition');

    window.localStorage.setItem(STORAGE_KEY, '{invalid-json');
    const fallback = loadProgressState();
    expect(fallback.completedStages).toEqual([]);
  });

  it('normalizes and persists state in localStorage', () => {
    saveProgressState({
      ...DEFAULT_PROGRESS_STATE,
      completedStages: [3, 0, 3, 99, -1],
      lastVisitedStage: 3,
      depthMode: 'deep',
      theme: 'dark',
    });

    const loaded = loadProgressState();
    expect(loaded.completedStages).toEqual([0, 3]);
    expect(loaded.lastVisitedStage).toBe(3);
    expect(loaded.depthMode).toBe('deep');
    expect(loaded.theme).toBe('dark');
  });

  it('round-trips backup JSON cleanly', () => {
    const state = {
      ...DEFAULT_PROGRESS_STATE,
      completedStages: [0, 2, 4],
      lastVisitedStage: 4,
      depthMode: 'deep' as const,
      theme: 'dark' as const,
    };

    const json = serializeBackup(state);
    const parsed = parseAndValidateBackup(json);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.state.completedStages).toEqual([0, 2, 4]);
      expect(parsed.state.lastVisitedStage).toBe(4);
      expect(parsed.state.depthMode).toBe('deep');
      expect(parsed.state.theme).toBe('dark');
    }
  });

  it('rejects malformed JSON or out-of-range stage IDs', () => {
    expect(parseAndValidateBackup('not json').ok).toBe(false);
    expect(parseAndValidateBackup('[]').ok).toBe(false);
    expect(parseAndValidateBackup(JSON.stringify({ completedStages: [7] })).ok).toBe(false);
    expect(parseAndValidateBackup(JSON.stringify({ completedStages: [-1] })).ok).toBe(false);
    expect(
      parseAndValidateBackup(
        JSON.stringify({ completedStages: [1], depthMode: 'expert' }),
      ).ok,
    ).toBe(false);
  });
});
