import { useEffect, useState } from 'react';
import { BackupModal } from './components/BackupModal';
import { Header } from './components/Header';
import { RoadmapView } from './components/RoadmapView';
import { StageView } from './components/StageView';
import { CURRICULUM_STAGES, getStageById, TOTAL_STAGE_COUNT } from './data/curriculum';
import { useAtlasState } from './hooks/useAtlasState';

function parseStageIdFromHash(): number | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/^#\/stage\/(\d+)$/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return getStageById(parsed) ? parsed : null;
}

export function App() {
  const {
    state,
    toggleStageComplete,
    markStageVisited,
    setDepthMode,
    toggleTheme,
    importState,
    resetProgress,
  } = useAtlasState();

  const [activeStageId, setActiveStageId] = useState<number | null>(() =>
    parseStageIdFromHash(),
  );
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveStageId(parseStageIdFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToRoadmap = () => {
    window.location.hash = '#/';
    setActiveStageId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStage = (stageId: number) => {
    window.location.hash = `#/stage/${stageId}`;
    setActiveStageId(stageId);
    markStageVisited(stageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeStage =
    activeStageId !== null ? getStageById(activeStageId) : undefined;

  return (
    <div className="min-h-screen bg-[var(--bg-paper)] text-[var(--text-ink)]">
      <Header
        completedCount={state.completedStages.length}
        totalCount={TOTAL_STAGE_COUNT}
        theme={state.theme}
        isRoadmapView={activeStage === undefined}
        onNavigateRoadmap={navigateToRoadmap}
        onToggleTheme={toggleTheme}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {activeStage ? (
        <StageView
          stage={activeStage}
          prevStage={getStageById(activeStage.id - 1)}
          nextStage={getStageById(activeStage.id + 1)}
          isCompleted={state.completedStages.includes(activeStage.id)}
          depthMode={state.depthMode}
          onSetDepthMode={setDepthMode}
          onToggleComplete={toggleStageComplete}
          onNavigateRoadmap={navigateToRoadmap}
          onSelectStage={navigateToStage}
        />
      ) : (
        <RoadmapView
          stages={CURRICULUM_STAGES}
          completedStages={state.completedStages}
          lastVisitedStage={state.lastVisitedStage}
          onSelectStage={navigateToStage}
          onToggleComplete={toggleStageComplete}
        />
      )}

      <BackupModal
        isOpen={isBackupOpen}
        state={state}
        onClose={() => setIsBackupOpen(false)}
        onImport={importState}
        onReset={resetProgress}
      />
    </div>
  );
}

export default App;
