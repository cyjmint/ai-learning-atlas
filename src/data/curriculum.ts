import type { StageData } from '../types/atlas';
import { STAGES_0_TO_3 } from './stages0to3';
import { STAGES_4_TO_6 } from './stages4to6';

export const CURRICULUM_STAGES: StageData[] = [
  ...STAGES_0_TO_3,
  ...STAGES_4_TO_6,
];

export const TOTAL_STAGE_COUNT = CURRICULUM_STAGES.length;

export function getStageById(stageId: number): StageData | undefined {
  return CURRICULUM_STAGES.find((stage) => stage.id === stageId);
}
