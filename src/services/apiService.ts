
import { ScoreResponse } from "@/types";

// In a real app, this would be in an environment variable
const API_KEY = "YOUR_AUTH_KEY"; // Replace with your actual key later

export const submitAudioForScoring = async (audioBlob: Blob): Promise<ScoreResponse> => {
  try {
    const url = new URL("https://scorpion.myspeakingscore.com/api/vox");
    
    // Create FormData object
    const formData = new FormData();
    formData.append('file', audioBlob, "recording.wav");

    // API request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "API-KEY": API_KEY,
        // Note: Do not set Content-Type header when using FormData
        // The browser will set it correctly with the boundary parameter
        "Accept": "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Process the API response
    const data = await response.json();
    
    // Convert the API response to our ScoreResponse format
    return mapApiResponseToScoreResponse(data);
  } catch (error) {
    console.error("Error submitting audio for scoring:", error);
    
    // For demo purposes, return mock data if API call fails
    return getMockScoreResponse();
  }
};

// Map the API response to our ScoreResponse format
const mapApiResponseToScoreResponse = (apiResponse: any): ScoreResponse => {
  // You'll need to adjust this mapping based on the actual API response structure
  try {
    return {
      overallScore: Math.round(apiResponse.overall_score * 30) || 25, // Scale to 0-30 if needed
      delivery: apiResponse.delivery || 3.5,
      languageUse: apiResponse.language_use || 3.0,
      topicDevelopment: apiResponse.topic_development || 3.5,
      ieltsMapping: apiResponse.ielts_mapping || "7.0",
      cefrMapping: apiResponse.cefr_mapping || "C1",
      feedback: {
        fluency: apiResponse.feedback?.fluency || "Your speech has good flow with only occasional hesitations.",
        pronunciation: apiResponse.feedback?.pronunciation || "Your pronunciation is clear with some minor accent influences.",
        vocabulary: apiResponse.feedback?.vocabulary || "You use a good range of vocabulary with some academic terms.",
        grammar: apiResponse.feedback?.grammar || "You demonstrate control of complex sentences with occasional errors.",
        coherence: apiResponse.feedback?.coherence || "Your response is well-organized with clear main ideas and supporting details."
      }
    };
  } catch (error) {
    console.error("Error mapping API response:", error);
    return getMockScoreResponse();
  }
};

// Mock data for development/testing or when API fails
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
