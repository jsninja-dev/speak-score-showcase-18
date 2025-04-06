export interface SpeakingPrompt {
  id: string;
  question: string;
  prepTime: number; // in seconds
  speakTime: number; // in seconds
}

export interface ScoreResponse {
  overallScore: number;
  
  // Delivery Construct
  delivery: {
    speakingRate: number;        // SR
    sustainedSpeech: number;     // SS
    pauseFrequency: number;      // PF
    pauseDistribution: number;   // DP
    repetitions: number;         // Re
    rhythm: number;              // Rh
    vowels: number;              // Vo
  };
  
  // Language Use Construct
  languageUse: {
    vocabularyDepth: number;     // VDe
    vocabularyDiversity: number; // VDi
    grammaticalAccuracy: number; // GA
    grammaticalComplexity: number; // GC
  };
  
  // Topic Development Construct
  topicDevelopment: number;      // DC
  
  ieltsMapping: string;
  cefrMapping: string;
  
  feedback: {
    speakingRate: string;
    sustainedSpeech: string;
    pauseFrequency: string;
    pauseDistribution: string;
    repetitions: string;
    rhythm: string;
    vowels: string;
    vocabularyDepth: string;
    vocabularyDiversity: string;
    grammaticalAccuracy: string;
    grammaticalComplexity: string;
    discourseCoherence: string;
  };
  
  additionalMetrics: {
    wpm: number;
    audioLength: string;
    transcript: string;
  };
}
