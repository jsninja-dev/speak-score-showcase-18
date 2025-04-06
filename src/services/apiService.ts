import { ScoreResponse } from "@/types";

// In a real app, this would be in an environment variable
const API_KEY = import.meta.env.VITE_API_KEY; // Replace with your actual key later

export const submitAudioForScoring = async (audioBlob: Blob): Promise<ScoreResponse | String> => {
  try {
    const url = new URL(
      "https://scorpion.myspeakingscore.com/api/speech-rater"
    );
    
    const headers = {
        "API-KEY": API_KEY,
        "Accept": "application/json",
    };
    
    const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });

    const formData = new FormData();
    formData.append('with_feedback', 'yes');
    formData.append('file', file);

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: formData,
    });
    
    const data = await response.json();
    if (data.success === false) {
      throw new Error(data.error || "API request failed");
    }

    // store/push api response in local storage
    const mySpeakingScore = localStorage.getItem("mySpeakingScore");
    if (mySpeakingScore) {
      const mySpeakingScoreArray = JSON.parse(mySpeakingScore);
      mySpeakingScoreArray.push(data);
      localStorage.setItem("mySpeakingScore", JSON.stringify(mySpeakingScoreArray));
    } else {
      localStorage.setItem("mySpeakingScore", JSON.stringify([data]));
    }
    
    // Convert the API response to our ScoreResponse format
    return mapApiResponseToScoreResponse(data);
  } catch (error) {
    return error.message;
    
    // For demo purposes, return mock data if API call fails
    // return getMockScoreResponse();
  }
};

// Map the API response to our ScoreResponse format
const mapApiResponseToScoreResponse = (apiResponse: any): ScoreResponse => {
  try {
    return {
      // Overall TOEFL Speaking Score
      overallScore: apiResponse["TOEFL Speaking Score"],
      
      // Delivery Construct
      delivery: {
        speakingRate: apiResponse.sr_score / 10,        // Speaking Rate (SR)
        sustainedSpeech: apiResponse.ss_score / 10,     // Sustained Speech (SS)
        pauseFrequency: apiResponse.pf_score / 10,      // Pause Frequency (PF)
        pauseDistribution: apiResponse.dp_score / 10,   // Distribution of Pauses (DP)
        repetitions: apiResponse.re_score / 10,         // Repetitions (Re)
        rhythm: apiResponse.rh_score / 10,              // Rhythm (Rh)
        vowels: apiResponse.vo_score / 10               // Vowels (Vo)
      },
      
      // Language Use Construct
      languageUse: {
        vocabularyDepth: apiResponse.vde_score / 10,    // Vocabulary Depth (VDe)
        vocabularyDiversity: apiResponse.vdi_score / 10, // Vocabulary Diversity (VDi)
        grammaticalAccuracy: apiResponse.ga_score / 10,  // Grammatical Accuracy (GA)
        grammaticalComplexity: apiResponse.gc_score / 10 // Grammatical Complexity (GC)
      },
      
      // Topic Development Construct
      topicDevelopment: apiResponse.dc_score / 10,      // Discourse Coherence (DC)
      
      // Standardized Test Mappings
      ieltsMapping: apiResponse["IELTS Speaking Estimate"],
      cefrMapping: apiResponse["CEFR Estimate"],
      
      // Detailed Feedback
      feedback: {
        speakingRate: generateFeedback("speakingRate", apiResponse.sr_score),
        sustainedSpeech: generateFeedback("sustainedSpeech", apiResponse.ss_score),
        pauseFrequency: generateFeedback("pauseFrequency", apiResponse.pf_score),
        pauseDistribution: generateFeedback("pauseDistribution", apiResponse.dp_score),
        repetitions: generateFeedback("repetitions", apiResponse.re_score),
        rhythm: generateFeedback("rhythm", apiResponse.rh_score),
        vowels: generateFeedback("vowels", apiResponse.vo_score),
        vocabularyDepth: generateFeedback("vocabularyDepth", apiResponse.vde_score),
        vocabularyDiversity: generateFeedback("vocabularyDiversity", apiResponse.vdi_score),
        grammaticalAccuracy: generateFeedback("grammaticalAccuracy", apiResponse.ga_score),
        grammaticalComplexity: generateFeedback("grammaticalComplexity", apiResponse.gc_score),
        discourseCoherence: generateFeedback("discourseCoherence", apiResponse.dc_score)
      },

      // Additional Metrics
      additionalMetrics: {
        wpm: apiResponse.wpm,
        audioLength: apiResponse.audio_length,
        transcript: apiResponse.transcript
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
      case "speakingRate":
        return "Excellent speaking rate. Your pace is natural and easy to follow.";
      case "sustainedSpeech":
        return "Excellent sustained speech. You maintain a consistent flow with minimal interruptions.";
      case "pauseFrequency":
        return "Excellent pause frequency. Your pauses are natural and well-timed.";
      case "pauseDistribution":
        return "Excellent pause distribution. Your pauses occur at natural breaks in speech.";
      case "repetitions":
        return "Excellent control of repetitions. Your speech flows naturally without unnecessary repetition.";
      case "rhythm":
        return "Excellent rhythm. Your speech has a natural cadence and flow.";
      case "vowels":
        return "Excellent vowel articulation. Your vowel sounds are clear and consistent.";
      case "vocabularyDepth":
        return "Excellent vocabulary depth. You use precise and varied words appropriately.";
      case "vocabularyDiversity":
        return "Excellent vocabulary diversity. You use a wide range of words effectively.";
      case "grammaticalAccuracy":
        return "Excellent grammatical accuracy. Your sentences are consistently correct.";
      case "grammaticalComplexity":
        return "Excellent grammatical complexity. You use varied and sophisticated sentence structures.";
      case "discourseCoherence":
        return "Excellent discourse coherence. Your ideas are well-organized and logically connected.";
      default:
        return "Excellent performance in this area.";
    }
  } else if (score >= 70) {
    switch (category) {
      case "speakingRate":
        return "Good speaking rate. Your pace is generally appropriate with occasional variations.";
      case "sustainedSpeech":
        return "Good sustained speech. You maintain a good flow with some minor interruptions.";
      case "pauseFrequency":
        return "Good pause frequency. Your pauses are generally appropriate.";
      case "pauseDistribution":
        return "Good pause distribution. Your pauses mostly occur at appropriate points.";
      case "repetitions":
        return "Good control of repetitions. Your speech has occasional but not disruptive repetition.";
      case "rhythm":
        return "Good rhythm. Your speech has a generally natural flow.";
      case "vowels":
        return "Good vowel articulation. Your vowel sounds are mostly clear.";
      case "vocabularyDepth":
        return "Good vocabulary depth. You use appropriate words with some variety.";
      case "vocabularyDiversity":
        return "Good vocabulary diversity. You use a good range of words.";
      case "grammaticalAccuracy":
        return "Good grammatical accuracy. Your sentences are mostly correct.";
      case "grammaticalComplexity":
        return "Good grammatical complexity. You use varied sentence structures.";
      case "discourseCoherence":
        return "Good discourse coherence. Your ideas are generally well-organized.";
      default:
        return "Good performance in this area.";
    }
  } else if (score >= 50) {
    switch (category) {
      case "speakingRate":
        return "Fair speaking rate. Your pace varies and could be more consistent.";
      case "sustainedSpeech":
        return "Fair sustained speech. You have noticeable interruptions in your flow.";
      case "pauseFrequency":
        return "Fair pause frequency. Your pauses are sometimes too frequent or too long.";
      case "pauseDistribution":
        return "Fair pause distribution. Your pauses sometimes occur at awkward points.";
      case "repetitions":
        return "Fair control of repetitions. Your speech has noticeable repetition.";
      case "rhythm":
        return "Fair rhythm. Your speech flow could be more natural.";
      case "vowels":
        return "Fair vowel articulation. Some vowel sounds need improvement.";
      case "vocabularyDepth":
        return "Fair vocabulary depth. You could use more precise and varied words.";
      case "vocabularyDiversity":
        return "Fair vocabulary diversity. You could use a wider range of words.";
      case "grammaticalAccuracy":
        return "Fair grammatical accuracy. You have some consistent errors.";
      case "grammaticalComplexity":
        return "Fair grammatical complexity. You could use more varied sentence structures.";
      case "discourseCoherence":
        return "Fair discourse coherence. Your ideas could be better organized.";
      default:
        return "Fair performance in this area.";
    }
  } else {
    switch (category) {
      case "speakingRate":
        return "Your speaking rate needs improvement. Try to maintain a more consistent pace.";
      case "sustainedSpeech":
        return "Your sustained speech needs improvement. Work on maintaining a continuous flow.";
      case "pauseFrequency":
        return "Your pause frequency needs improvement. Try to reduce unnecessary pauses.";
      case "pauseDistribution":
        return "Your pause distribution needs improvement. Pauses should occur at natural breaks.";
      case "repetitions":
        return "Your control of repetitions needs improvement. Try to reduce unnecessary repetition.";
      case "rhythm":
        return "Your rhythm needs improvement. Work on developing a more natural speech flow.";
      case "vowels":
        return "Your vowel articulation needs improvement. Focus on clear vowel sounds.";
      case "vocabularyDepth":
        return "Your vocabulary depth needs improvement. Work on using more precise words.";
      case "vocabularyDiversity":
        return "Your vocabulary diversity needs improvement. Try to use a wider range of words.";
      case "grammaticalAccuracy":
        return "Your grammatical accuracy needs improvement. Focus on correct sentence structure.";
      case "grammaticalComplexity":
        return "Your grammatical complexity needs improvement. Try using more varied sentences.";
      case "discourseCoherence":
        return "Your discourse coherence needs improvement. Work on organizing your ideas better.";
      default:
        return "This area needs improvement.";
    }
  }
};

// Mock data for development/testing or when API fails
const getMockScoreResponse = (): ScoreResponse => {
  return {
    overallScore: 25,
    delivery: {
      speakingRate: 3.5,
      sustainedSpeech: 3.0,
      pauseFrequency: 3.5,
      pauseDistribution: 3.0,
      repetitions: 3.0,
      rhythm: 3.5,
      vowels: 3.0
    },
    languageUse: {
      vocabularyDepth: 3.0,
      vocabularyDiversity: 3.5,
      grammaticalAccuracy: 3.0,
      grammaticalComplexity: 3.5
    },
    topicDevelopment: 3.5,
    ieltsMapping: "7.0",
    cefrMapping: "C1",
    feedback: {
      speakingRate: "Good speaking rate. Your pace is generally appropriate with occasional variations.",
      sustainedSpeech: "Good sustained speech. You maintain a good flow with some minor interruptions.",
      pauseFrequency: "Good pause frequency. Your pauses are generally appropriate.",
      pauseDistribution: "Good pause distribution. Your pauses mostly occur at appropriate points.",
      repetitions: "Good control of repetitions. Your speech has occasional but not disruptive repetition.",
      rhythm: "Good rhythm. Your speech has a generally natural flow.",
      vowels: "Good vowel articulation. Your vowel sounds are mostly clear.",
      vocabularyDepth: "Good vocabulary depth. You use appropriate words with some variety.",
      vocabularyDiversity: "Good vocabulary diversity. You use a good range of words.",
      grammaticalAccuracy: "Good grammatical accuracy. Your sentences are mostly correct.",
      grammaticalComplexity: "Good grammatical complexity. You use varied sentence structures.",
      discourseCoherence: "Good discourse coherence. Your ideas are generally well-organized."
    },
    additionalMetrics: {
      wpm: 120,
      audioLength: "120",
      transcript: "This is a sample transcript."
    }
  };
};
