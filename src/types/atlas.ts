export type DepthMode = 'intuition' | 'deep';
export type ThemeMode = 'light' | 'dark';

export type SimulatorId =
  | 'gradient-descent'
  | 'word-embedding'
  | 'self-attention'
  | 'token-sampling'
  | 'frontier-ai';

export type DiagramId = 'math-intuition' | 'symbolic-to-ml';

export type ResourceLanguage = '한국어' | '영어 원문';
export type ResourceDifficulty = '입문' | '중급' | '심화';

export interface ResourceItem {
  title: string;
  author: string;
  url: string;
  language: ResourceLanguage;
  subtitleInfo: string;
  difficulty: ResourceDifficulty;
  duration: string;
  note: string;
}

export interface DeepDiveFormula {
  label: string;
  latex: string;
  explanation: string;
}

export interface PaperHighlight {
  title: string;
  authors: string;
  year: number;
  venue?: string;
  takeaway: string;
}

export interface DeepDiveContent {
  title: string;
  formulas: DeepDiveFormula[];
  papers: PaperHighlight[];
  implementationPoints: string[];
  codeSnippet?: {
    language: string;
    caption: string;
    code: string;
  };
}

export interface CausalSection {
  kind: 'limitation' | 'mechanism' | 'bridge';
  heading: string;
  lead: string;
  paragraphs: string[];
  analogy?: {
    title: string;
    body: string;
  };
  keyPoints: string[];
  deepDive?: DeepDiveContent;
}

export interface StageData {
  id: number;
  badge: string;
  isOptional?: boolean;
  title: string;
  subtitle: string;
  readingTime: string;
  coreQuestion: string;
  summary: string;
  topics: string[];
  simulatorId?: SimulatorId;
  simulatorCaption?: string;
  diagramId?: DiagramId;
  sections: [CausalSection, CausalSection, CausalSection];
  nextBridgeTeaser?: string;
  resources: ResourceItem[];
}

export interface AtlasProgressState {
  version: 1;
  completedStages: number[];
  lastVisitedStage: number | null;
  depthMode: DepthMode;
  theme: ThemeMode;
  updatedAt: string;
}
