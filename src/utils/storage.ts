import type { AtlasProgressState, DepthMode, ThemeMode } from '../types/atlas';

export const STORAGE_KEY = 'frontier-ai-atlas:v1';
export const MIN_STAGE_ID = 0;
export const MAX_STAGE_ID = 6;

export const DEFAULT_PROGRESS_STATE: AtlasProgressState = {
  version: 1,
  completedStages: [],
  lastVisitedStage: null,
  depthMode: 'intuition',
  theme: 'light',
  updatedAt: new Date(0).toISOString(),
};

function isValidStageId(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= MIN_STAGE_ID &&
    value <= MAX_STAGE_ID
  );
}

function isValidDepthMode(value: unknown): value is DepthMode {
  return value === 'intuition' || value === 'deep';
}

function isValidThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

function normalizeCompletedStages(stages: number[]): number[] {
  return Array.from(new Set(stages.filter(isValidStageId))).sort((a, b) => a - b);
}

export function loadProgressState(): AtlasProgressState {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_PROGRESS_STATE };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_PROGRESS_STATE, updatedAt: new Date().toISOString() };
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_PROGRESS_STATE, updatedAt: new Date().toISOString() };
    }

    const obj = parsed as Record<string, unknown>;
    const completedStages = Array.isArray(obj.completedStages)
      ? normalizeCompletedStages(obj.completedStages.filter(isValidStageId))
      : [];
    const lastVisitedStage = isValidStageId(obj.lastVisitedStage)
      ? obj.lastVisitedStage
      : null;
    const depthMode = isValidDepthMode(obj.depthMode) ? obj.depthMode : 'intuition';
    const theme = isValidThemeMode(obj.theme) ? obj.theme : 'light';
    const updatedAt =
      typeof obj.updatedAt === 'string' && obj.updatedAt.length > 0
        ? obj.updatedAt
        : new Date().toISOString();

    return {
      version: 1,
      completedStages,
      lastVisitedStage,
      depthMode,
      theme,
      updatedAt,
    };
  } catch {
    return { ...DEFAULT_PROGRESS_STATE, updatedAt: new Date().toISOString() };
  }
}

export function saveProgressState(state: AtlasProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export function serializeBackup(state: AtlasProgressState): string {
  return JSON.stringify(
    {
      ...state,
      version: 1,
      completedStages: normalizeCompletedStages(state.completedStages),
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  );
}

export type BackupParseResult =
  | { ok: true; state: AtlasProgressState }
  | { ok: false; error: string };

export function parseAndValidateBackup(rawJson: string): BackupParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return {
      ok: false,
      error: '올바른 JSON 파일이 아닙니다. 파일 내용을 확인해 주세요.',
    };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      ok: false,
      error: '백업 데이터 형식이 올바르지 않습니다. 객체 형태의 JSON이 필요합니다.',
    };
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.version !== undefined && obj.version !== 1) {
    return {
      ok: false,
      error: `지원하지 않는 백업 버전(${String(obj.version)})입니다.`,
    };
  }

  if (!Array.isArray(obj.completedStages)) {
    return {
      ok: false,
      error: '완료한 단계 목록(completedStages)이 배열 형식이 아닙니다.',
    };
  }

  for (const item of obj.completedStages) {
    if (!isValidStageId(item)) {
      return {
        ok: false,
        error: `유효하지 않은 단계 번호(${String(item)})가 포함되어 있습니다. (0-6 범위의 정수만 허용)`,
      };
    }
  }

  if (
    obj.lastVisitedStage !== undefined &&
    obj.lastVisitedStage !== null &&
    !isValidStageId(obj.lastVisitedStage)
  ) {
    return {
      ok: false,
      error: '최근 학습 단계(lastVisitedStage) 값이 유효하지 않습니다.',
    };
  }

  if (obj.depthMode !== undefined && !isValidDepthMode(obj.depthMode)) {
    return {
      ok: false,
      error: '학습 깊이 설정(depthMode) 값이 유효하지 않습니다.',
    };
  }

  if (obj.theme !== undefined && !isValidThemeMode(obj.theme)) {
    return {
      ok: false,
      error: '테마 설정(theme) 값이 유효하지 않습니다.',
    };
  }

  return {
    ok: true,
    state: {
      version: 1,
      completedStages: normalizeCompletedStages(obj.completedStages as number[]),
      lastVisitedStage:
        obj.lastVisitedStage === undefined ? null : (obj.lastVisitedStage as number | null),
      depthMode: obj.depthMode ?? 'intuition',
      theme: obj.theme ?? 'light',
      updatedAt: new Date().toISOString(),
    },
  };
}
