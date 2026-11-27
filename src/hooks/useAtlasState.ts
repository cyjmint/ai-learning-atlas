import { useCallback, useEffect, useState } from 'react';
import type { AtlasProgressState, DepthMode } from '../types/atlas';
import {
  DEFAULT_PROGRESS_STATE,
  loadProgressState,
  saveProgressState,
} from '../utils/storage';

export function useAtlasState() {
  const [state, setState] = useState<AtlasProgressState>(() => loadProgressState());

  useEffect(() => {
    saveProgressState(state);
  }, [state]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }
  }, [state.theme]);

  const toggleStageComplete = useCallback((stageId: number) => {
    setState((prev) => {
      const exists = prev.completedStages.includes(stageId);
      const completedStages = exists
        ? prev.completedStages.filter((id) => id !== stageId)
        : [...prev.completedStages, stageId].sort((a, b) => a - b);

      return {
        ...prev,
        completedStages,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const markStageVisited = useCallback((stageId: number) => {
    setState((prev) => {
      if (prev.lastVisitedStage === stageId) return prev;
      return {
        ...prev,
        lastVisitedStage: stageId,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const setDepthMode = useCallback((depthMode: DepthMode) => {
    setState((prev) => {
      if (prev.depthMode === depthMode) return prev;
      return {
        ...prev,
        depthMode,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const importState = useCallback((nextState: AtlasProgressState) => {
    setState({
      ...nextState,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const resetProgress = useCallback(() => {
    setState((prev) => ({
      ...DEFAULT_PROGRESS_STATE,
      theme: prev.theme,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  return {
    state,
    toggleStageComplete,
    markStageVisited,
    setDepthMode,
    toggleTheme,
    importState,
    resetProgress,
  };
}
