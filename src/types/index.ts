
export interface SpeakingPrompt {
  id: string;
  question: string;
  prepTime: number; // in seconds
  speakTime: number; // in seconds
}

export interface ScoreResponse {
  overallScore: number; // 0-30
  delivery: number; // 0-4
  languageUse: number; // 0-4
  topicDevelopment: number; // 0-4
  ieltsMapping: string; // e.g., "6.5"
  cefrMapping: string; // e.g., "B2"
  feedback: {
    fluency: string;
    pronunciation: string;
    vocabulary: string;
    grammar: string;
    coherence: string;
  }
}
