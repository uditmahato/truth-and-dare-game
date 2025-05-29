export interface Player {
  id: string;
  name: string;
}

export enum QuestionCategory {
  INTENSE = "Intense",
  ROMANTIC = "Romantic",
  CAREER = "Career",
  DECEPTION = "Deception",
  FUN = "Fun",
  WILD = "Wild",
  CUSTOM = "Custom (AI Generated)", // For AI generated questions
}

export type QuestionType = 'truth' | 'dare';

export interface QuestionItem {
  id: string;
  type: QuestionType;
  text: string;
  categories: QuestionCategory[];
}

export enum GamePhase {
  HOME = 'HOME', // New home phase
  PLAYER_SETUP = 'PLAYER_SETUP',
  CATEGORY_SETUP = 'CATEGORY_SETUP',
  READY_TO_SPIN = 'READY_TO_SPIN',
  SPINNING_WHEEL = 'SPINNING_WHEEL',
  PLAYER_SELECTED = 'PLAYER_SELECTED',
  AWAITING_QUESTION = 'AWAITING_QUESTION',
  QUESTION_DISPLAYED = 'QUESTION_DISPLAYED',
}