import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScoreResponse } from "@/types";
import { 
  Award, 
  MessageSquare, 
  Bookmark,
  BookOpen,
  FileText,
  Mic,
  Book,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

interface ScoreDisplayProps {
  score: ScoreResponse;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);


  // Helper function to render score bars (0-4 scale)
  const renderScoreBar = (score: number, label: string) => {
    const percentage = (score / 10) * 100;
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-bold">{score.toFixed(1)}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 to-blue-500" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your report...",
      });

      const options = {
        margin: 0.4,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: [8.3, 20.5], orientation: 'portrait' }
      };

      await html2pdf().set(options).from(reportRef.current).save();

      toast({
        title: "PDF Generated",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="flex justify-end mb-2">
        <Button 
          onClick={handleExportPDF} 
          variant="outline" 
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Export as PDF
        </Button>
      </div>

      <div ref={reportRef}>
        <Card ref={scoreRef} className="border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-500" /> 
                Your Speaking Score
              </span>
              <span className="text-3xl font-bold text-blue-500">
                {score.overallScore}/30
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Delivery Construct */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground flex items-center">
                <Mic className="h-4 w-4 mr-2" />
                DELIVERY CONSTRUCT
              </h3>
              {renderScoreBar(score.delivery.speakingRate, "Speaking Rate (SR)")}
              {renderScoreBar(score.delivery.sustainedSpeech, "Sustained Speech (SS)")}
              {renderScoreBar(score.delivery.pauseFrequency, "Pause Frequency (PF)")}
              {renderScoreBar(score.delivery.pauseDistribution, "Pause Distribution (DP)")}
              {renderScoreBar(score.delivery.repetitions, "Repetitions (Re)")}
              {renderScoreBar(score.delivery.rhythm, "Rhythm (Rh)")}
              {renderScoreBar(score.delivery.vowels, "Vowels (Vo)")}
            </div>

            <Separator />

            {/* Language Use Construct */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground flex items-center">
                <Book className="h-4 w-4 mr-2" />
                LANGUAGE USE CONSTRUCT
              </h3>
              {/* {renderScoreBar(score.languageUse.vocabularyDepth, "Vocabulary Depth (VDe)")} */}
              {renderScoreBar(score.languageUse.vocabularyDiversity, "Vocabulary Diversity (VDi)")}
              {renderScoreBar(score.languageUse.grammaticalAccuracy, "Grammatical Accuracy (GA)")}
              {/* {renderScoreBar(score.languageUse.grammaticalComplexity, "Grammatical Complexity (GC)")} */}
            </div>

            <Separator />

            {/* Topic Development Construct */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground flex items-center">
                <Target className="h-4 w-4 mr-2" />
                TOPIC DEVELOPMENT CONSTRUCT
              </h3>
              {renderScoreBar(score.topicDevelopment, "Discourse Coherence (DC)")}
            </div>

            <Separator />

            {/* Equivalent Scores */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">EQUIVALENT SCORES</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Bookmark className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium">IELTS</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{score.ieltsMapping}</p>
                  </CardContent>
                </Card>
                <Card className="bg-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium">CEFR</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{score.cefrMapping}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card ref={feedbackRef} className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" /> 
              Detailed Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FeedbackItem 
              title="Speaking Rate" 
              content={score.feedback.speakingRate} 
            />
            <Separator />
            <FeedbackItem 
              title="Sustained Speech" 
              content={score.feedback.sustainedSpeech} 
            />
            <Separator />
            <FeedbackItem 
              title="Pause Frequency" 
              content={score.feedback.pauseFrequency} 
            />
            <Separator />
            <FeedbackItem 
              title="Pause Distribution" 
              content={score.feedback.pauseDistribution} 
            />
            <Separator />
            <FeedbackItem 
              title="Repetitions" 
              content={score.feedback.repetitions} 
            />
            <Separator />
            <FeedbackItem 
              title="Rhythm" 
              content={score.feedback.rhythm} 
            />
            <Separator />
            <FeedbackItem 
              title="Vowels" 
              content={score.feedback.vowels} 
            />
            {/* <Separator />
            <FeedbackItem 
              title="Vocabulary Depth" 
              content={score.feedback.vocabularyDepth} 
            /> */}
            <Separator />
            <FeedbackItem 
              title="Vocabulary Diversity" 
              content={score.feedback.vocabularyDiversity} 
            />
            <Separator />
            <FeedbackItem 
              title="Grammatical Accuracy" 
              content={score.feedback.grammaticalAccuracy} 
            />
            {/* <Separator />
            <FeedbackItem 
              title="Grammatical Complexity" 
              content={score.feedback.grammaticalComplexity} 
            /> */}
            <Separator />
            <FeedbackItem 
              title="Discourse Coherence" 
              content={score.feedback.discourseCoherence} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for feedback items
function FeedbackItem({ title, content }: { title: string, content: string }) {
  return (
    <div className="space-y-1">
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-muted-foreground">{content}</p>
    </div>
  );
}
