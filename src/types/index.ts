export type TabType = 'concept' | 'checklist' | 'quiz' | 'picker' | 'activity';

export interface ComicScene {
  id: number;
  stage: string;
  title: string;
  speaker: string;
  dialogue: string;
  thought?: string;
  tip: string;
  category: 'audience' | 'preparation' | 'anxiety' | 'presentation';
}

export interface ChecklistItem {
  id: string;
  category: string;
  text: string;
  subtext?: string;
  tip?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  passage?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  textbookRef: string;
}

export interface PresenterHistory {
  id: string;
  number: number;
  name?: string;
  time: string;
  cheerMessage: string;
}
