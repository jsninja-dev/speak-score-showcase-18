
import { ScoreResponse } from "@/types";

// In a real app, this would be in an environment variable
const API_TOKEN = "your-bearer-token"; // Replace with your actual token

export const submitAudioForScoring = async (audioBlob: Blob): Promise<ScoreResponse> => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    const response = await fetch("https://api.myspeakingscore.com/v1/score", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting audio for scoring:", error);
    
    // For demo purposes, return mock data if API call fails
    return getMockScoreResponse();
  }
};

// Mock data for development/testing
const getMockScoreResponse = (): ScoreResponse => {
  return {
    overallScore: 25,
    delivery: 3.5,
    languageUse: 3.0,
    topicDevelopment: 3.5,
    ieltsMapping: "7.0",
    cefrMapping: "C1",
    feedback: {
      fluency: "Your speech has good flow with only occasional hesitations.",
      pronunciation: "Your pronunciation is clear with some minor accent influences.",
      vocabulary: "You use a good range of vocabulary with some academic terms.",
      grammar: "You demonstrate control of complex sentences with occasional errors.",
      coherence: "Your response is well-organized with clear main ideas and supporting details."
    }
  };
};
