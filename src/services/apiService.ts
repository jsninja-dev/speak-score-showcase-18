
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
    console.log("API response:", data);
    
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
  try {
    // Map the actual API response format to our ScoreResponse type
    return {
      // Scale the score from 0-4 to 0-30 for overall score
      overallScore: Math.round(apiResponse.score * 7.5),
      
      // Directly use the API's score (0-4 scale) for these
      delivery: apiResponse.score,
      languageUse: apiResponse.score,
      topicDevelopment: apiResponse.score,
      
      // Use the IELTS and CEFR mappings directly from elsa_results
      ieltsMapping: apiResponse.elsa_results?.ielts_score?.toString() || "6.5",
      cefrMapping: apiResponse.elsa_results?.cefr_level || "B2",
      
      // Generate feedback based on the ELSA scores
      feedback: {
        fluency: generateFeedback("fluency", apiResponse.elsa_results?.fluency),
        pronunciation: generateFeedback("pronunciation", apiResponse.elsa_results?.pronunciation),
        vocabulary: generateFeedback("vocabulary", apiResponse.elsa_results?.vocabulary),
        grammar: generateFeedback("grammar", apiResponse.elsa_results?.grammar),
        coherence: "Your response shows good organization and development of ideas."
      }
    };
  } catch (error) {
    console.error("Error mapping API response:", error);
    return getMockScoreResponse();
  }
};

// Generate feedback based on score category and value
const generateFeedback = (category: string, score?: number): string => {
  if (score === undefined) return "No data available for this category.";
  
  // Generate appropriate feedback based on the score and category
  if (score >= 90) {
    switch (category) {
      case "fluency":
        return "Excellent fluency. Your speech flows naturally with very few hesitations.";
      case "pronunciation":
        return "Excellent pronunciation. Your speech is clear and easily understood.";
      case "vocabulary":
        return "Excellent vocabulary. You use a wide range of precise and appropriate words.";
      case "grammar":
        return "Excellent grammar. You use complex sentences accurately with very few errors.";
      default:
        return "Excellent performance in this area.";
    }
  } else if (score >= 75) {
    switch (category) {
      case "fluency":
        return "Good fluency. Your speech has a natural flow with occasional hesitations.";
      case "pronunciation":
        return "Good pronunciation. Your speech is generally clear with minor accent influences.";
      case "vocabulary":
        return "Good vocabulary. You use a variety of words appropriately.";
      case "grammar":
        return "Good grammar. You use mostly correct sentences with some complex structures.";
      default:
        return "Good performance in this area.";
    }
  } else if (score >= 50) {
    switch (category) {
      case "fluency":
        return "Fair fluency. Your speech has some hesitations but remains understandable.";
      case "pronunciation":
        return "Fair pronunciation. Some sounds may be influenced by your native language.";
      case "vocabulary":
        return "Fair vocabulary. You use common words correctly but could expand your range.";
      case "grammar":
        return "Fair grammar. You have some errors but they don't prevent understanding.";
      default:
        return "Fair performance in this area.";
    }
  } else {
    switch (category) {
      case "fluency":
        return "Your speech has frequent pauses and hesitations. Practice speaking more regularly.";
      case "pronunciation":
        return "Your pronunciation needs improvement. Focus on the sounds that are difficult for you.";
      case "vocabulary":
        return "Try to expand your vocabulary range and use more varied expressions.";
      case "grammar":
        return "Work on your grammar accuracy. Focus on sentence structure and verb forms.";
      default:
        return "This area needs improvement.";
    }
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
