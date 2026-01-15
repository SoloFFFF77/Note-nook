
export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  tags: string[];
}

export type AIAction = 'summarize' | 'improve' | 'brainstorm' | 'simplify' | 'expand';

export interface AIResponse {
  text: string;
  success: boolean;
  error?: string;
}
