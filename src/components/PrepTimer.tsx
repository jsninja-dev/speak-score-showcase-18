
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTimer } from "@/hooks/useTimer";
import { Clock, ArrowRight } from "lucide-react";

interface PrepTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
}

export function PrepTimer({ duration, onComplete }: PrepTimerProps) {
  const [isStarted, setIsStarted] = useState(false);
  
  const {
    time,
    isRunning,
    start,
    pause,
    reset,
    formattedTime,
    percentageRemaining
  } = useTimer(duration);

  useEffect(() => {
    if (!isRunning && time === 0) {
      onComplete();
    }
  }, [isRunning, time, onComplete]);

  const handleStart = () => {
    setIsStarted(true);
    start();
  };

  const handleSkip = () => {
    pause();
    onComplete();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Preparation Time
          </h3>
          <span className="text-2xl font-bold">{formattedTime}</span>
        </div>

        <Progress value={percentageRemaining} className="h-2" />

        {!isStarted ? (
          <Button onClick={handleStart} size="lg" className="w-full mt-4">
            Start Preparation
          </Button>
        ) : (
          <Button onClick={handleSkip} variant="outline" size="sm" className="w-full mt-4">
            <ArrowRight className="h-4 w-4 mr-2" />
            Skip to Recording
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
