
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useTimer } from "@/hooks/useTimer";
import { Mic, Square, PlayCircle, RefreshCw } from "lucide-react";

interface AudioRecorderProps {
  maxDuration: number; // in seconds
  onRecordingComplete: (audioBlob: Blob) => void;
}

export function AudioRecorder({ maxDuration, onRecordingComplete }: AudioRecorderProps) {
  const {
    isRecording,
    audioURL,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
    error
  } = useAudioRecorder();

  const {
    time,
    isRunning,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    formattedTime,
    percentageRemaining
  } = useTimer(maxDuration);

  const [recordingComplete, setRecordingComplete] = useState<boolean>(false);

  // Start the timer when recording starts
  useEffect(() => {
    if (isRecording) {
      startTimer();
    } else {
      pauseTimer();
    }
  }, [isRecording, startTimer, pauseTimer]);

  // Stop recording when timer ends
  useEffect(() => {
    if (isRunning && time === 0) {
      stopRecording();
      setRecordingComplete(true);
    }
  }, [isRunning, time, stopRecording]);

  // When recording completes, notify parent component
  useEffect(() => {
    if (recordingComplete && audioBlob) {
      onRecordingComplete(audioBlob);
    }
  }, [recordingComplete, audioBlob, onRecordingComplete]);

  const handleStartRecording = async () => {
    setRecordingComplete(false);
    resetTimer();
    await startRecording();
  };

  const handleStopRecording = async () => {
    await stopRecording();
    setRecordingComplete(true);
  };

  const handleReset = () => {
    resetRecording();
    resetTimer();
    setRecordingComplete(false);
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {error && (
        <div className="bg-destructive/20 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">{formattedTime}</div>
        {isRecording && (
          <div className="flex items-center">
            <span className="animate-pulse-recording h-3 w-3 bg-red-500 rounded-full mr-2"></span>
            <span className="text-sm text-red-500 font-medium">Recording</span>
          </div>
        )}
      </div>

      <Progress value={percentageRemaining} className="h-2" />

      <div className="flex gap-3 justify-center mt-6">
        {!isRecording && !audioURL && (
          <Button
            size="lg"
            onClick={handleStartRecording}
            className="bg-primary hover:bg-primary/90"
          >
            <Mic className="mr-2 h-5 w-5" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button
            size="lg"
            onClick={handleStopRecording}
            variant="destructive"
          >
            <Square className="mr-2 h-5 w-5" />
            Stop Recording
          </Button>
        )}

        {audioURL && (
          <>
            <audio src={audioURL} controls className="w-full mt-4" />
            <div className="flex gap-3 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Record Again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
