
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpeakingTest } from "@/components/SpeakingTest";
import { speakingPrompts } from "@/data/speakingPrompts";
import { Mic, BookOpen, BarChart } from "lucide-react";

export function LandingPage() {
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState(speakingPrompts[0].id);

  const selectedPrompt = speakingPrompts.find(p => p.id === selectedPromptId) || speakingPrompts[0];

  const handleStartTest = () => {
    setIsTestStarted(true);
  };

  const handleReset = () => {
    setIsTestStarted(false);
  };

  if (isTestStarted) {
    return <SpeakingTest prompt={selectedPrompt} onReset={handleReset} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">My Speaking Score</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Practice your TOEFL speaking skills and receive instant, detailed feedback
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="space-y-1">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Record Your Response</CardTitle>
            <CardDescription>
              Respond to a TOEFL-style speaking prompt with your microphone.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Expert Analysis</CardTitle>
            <CardDescription>
              Our AI evaluates your response using the same criteria as official tests.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Detailed Feedback</CardTitle>
            <CardDescription>
              Get comprehensive scores and actionable feedback to improve.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mx-auto max-w-4xl mb-12">
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Start a New Practice Test</CardTitle>
            <CardDescription>
              Select a speaking prompt and start practicing for your TOEFL test.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={selectedPromptId} onValueChange={setSelectedPromptId}>
              <TabsList className="grid grid-cols-3">
                {speakingPrompts.map((prompt) => (
                  <TabsTrigger key={prompt.id} value={prompt.id}>
                    Prompt {prompt.id.split('-')[1]}
                  </TabsTrigger>
                ))}
              </TabsList>
              {speakingPrompts.map((prompt) => (
                <TabsContent key={prompt.id} value={prompt.id} className="mt-6">
                  <div className="p-4 bg-accent rounded-md">
                    <p>{prompt.question}</p>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Preparation time: {prompt.prepTime} seconds</p>
                    <p>Speaking time: {prompt.speakTime} seconds</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button size="lg" onClick={handleStartTest} className="w-full">
              Start Practice Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
