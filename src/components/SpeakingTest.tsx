
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrepTimer } from "@/components/PrepTimer";
import { AudioRecorder } from "@/components/AudioRecorder";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { submitAudioForScoring } from "@/services/apiService";
import { SpeakingPrompt, ScoreResponse } from "@/types";
import { Loader2, ArrowLeft, Clock, Mic, BarChart4 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

enum TestStage {
  INSTRUCTIONS,
  PREPARATION,
  SPEAKING,
  SCORING,
  RESULTS
}

interface SpeakingTestProps {
  prompt: SpeakingPrompt;
  onReset: () => void;
}

export function SpeakingTest({ prompt, onReset }: SpeakingTestProps) {
  const [stage, setStage] = useState<TestStage>(TestStage.INSTRUCTIONS);
  const [score, setScore] = useState<ScoreResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handlePrepComplete = () => {
    setStage(TestStage.SPEAKING);
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setStage(TestStage.SCORING);
    setIsSubmitting(true);

    try {
      // Log for debugging
      console.log("Submitting audio recording, size:", audioBlob.size, "bytes");
      
      const scoreResponse = await submitAudioForScoring(audioBlob);
      console.log("scoreResponse:", scoreResponse);
      if(typeof scoreResponse === "string") {
        throw new Error(scoreResponse || "API request failed");
      }
      
      // @ts-ignore
      setScore(scoreResponse);
      setStage(TestStage.RESULTS);
    } catch (error) {
      console.error("Error processing recording:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setStage(TestStage.SPEAKING);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStageContent = () => {
    switch (stage) {
      case TestStage.INSTRUCTIONS:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Speaking Practice Test</CardTitle>
              <CardDescription>
                Follow the instructions to complete your TOEFL-style speaking practice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Your Task</h3>
                <div className="p-4 bg-accent rounded-md">
                  <p>{prompt.question}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">What to expect:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>You'll get {prompt.prepTime} seconds to prepare your answer.</li>
                  <li>You'll have {prompt.speakTime} seconds to speak.</li>
                  <li>After recording, your response will be scored.</li>
                  <li>You'll receive detailed feedback on your speaking skills.</li>
                </ul>
              </div>

              <Button 
                onClick={() => setStage(TestStage.PREPARATION)} 
                size="lg"
                className="w-full mt-4"
              >
                Begin Test
              </Button>
            </CardContent>
          </Card>
        );

      case TestStage.PREPARATION:
        return (
          <div className="space-y-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Preparation Stage</CardTitle>
                <CardDescription>
                  Take a moment to organize your thoughts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-accent rounded-md mb-6">
                  <p>{prompt.question}</p>
                </div>
                <PrepTimer duration={prompt.prepTime} onComplete={handlePrepComplete} />
              </CardContent>
            </Card>
          </div>
        );

      case TestStage.SPEAKING:
        return (
          <div className="space-y-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Speaking Stage</CardTitle>
                <CardDescription>
                  Record your response to the prompt. Aim to speak for about {prompt.speakTime} seconds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-accent rounded-md mb-6">
                  <p>{prompt.question}</p>
                </div>
                <AudioRecorder 
                  maxDuration={prompt.speakTime} 
                  onRecordingComplete={handleRecordingComplete} 
                />
              </CardContent>
            </Card>
          </div>
        );

      case TestStage.SCORING:
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="mt-4 text-xl font-semibold">Analyzing your speaking...</h2>
            <p className="text-muted-foreground mt-2">This may take a moment</p>
          </div>
        );

      case TestStage.RESULTS:
        return score ? (
          <>
            <div className="flex justify-between items-center w-full">
              <Button variant="outline" onClick={onReset}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Start New Test
              </Button>
            </div>
            <ScoreDisplay score={score} />
          </>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-10">
      {/* Progress Tabs - only show for early stages */}
      {stage < TestStage.RESULTS && (
        <Tabs value={`stage-${stage}`} className="w-full mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="stage-0" disabled={true} className={stage >= TestStage.INSTRUCTIONS ? "text-primary" : ""}>
              <Clock className="h-4 w-4 mr-2" />
              Instructions
            </TabsTrigger>
            <TabsTrigger value="stage-1" disabled={true} className={stage >= TestStage.PREPARATION ? "text-primary" : ""}>
              <Clock className="h-4 w-4 mr-2" />
              Preparation
            </TabsTrigger>
            <TabsTrigger value="stage-2" disabled={true} className={stage >= TestStage.SPEAKING ? "text-primary" : ""}>
              <Mic className="h-4 w-4 mr-2" />
              Speaking
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {renderStageContent()}
    </div>
  );
}
