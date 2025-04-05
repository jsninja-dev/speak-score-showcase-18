
import { useState, useEffect, useRef, useCallback } from "react";

interface TimerHook {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newTime?: number) => void;
  formattedTime: string;
  percentageRemaining: number;
}

export function useTimer(initialTime: number): TimerHook {
  const [time, setTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const initialTimeRef = useRef<number>(initialTime);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (time <= 0) return;
    setIsRunning(true);
  }, [time]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    if (newTime !== undefined) {
      setTime(newTime);
      initialTimeRef.current = newTime;
    } else {
      setTime(initialTimeRef.current);
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Format time as MM:SS
  const formattedTime = `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;

  // Calculate percentage of time remaining
  const percentageRemaining = Math.max(0, (time / initialTimeRef.current) * 100);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    formattedTime,
    percentageRemaining
  };
}
