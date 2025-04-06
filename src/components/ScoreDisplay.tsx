import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScoreResponse } from "@/types";
import { 
  Award, 
  MessageSquare, 
  Bookmark,
  BookOpen,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";

interface ScoreDisplayProps {
  score: ScoreResponse;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

  // Helper function to render score bars (0-4 scale)
  const renderScoreBar = (score: number, label: string) => {
    const percentage = (score / 4) * 100;
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

            // Usage
      const options = {
        margin: 1,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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
        <Card className="border-t-4 border-t-blue-500">
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">SCORE BREAKDOWN</h3>
                {renderScoreBar(score.delivery, "Delivery")}
                {renderScoreBar(score.languageUse, "Language Use")}
                {renderScoreBar(score.topicDevelopment, "Topic Development")}
              </div>

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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-500" /> 
              Detailed Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FeedbackItem 
              title="Fluency" 
              content={score.feedback.fluency} 
            />
            <Separator />
            <FeedbackItem 
              title="Pronunciation" 
              content={score.feedback.pronunciation} 
            />
            <Separator />
            <FeedbackItem 
              title="Vocabulary" 
              content={score.feedback.vocabulary} 
            />
            <Separator />
            <FeedbackItem 
              title="Grammar" 
              content={score.feedback.grammar} 
            />
            <Separator />
            <FeedbackItem 
              title="Coherence" 
              content={score.feedback.coherence} 
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
