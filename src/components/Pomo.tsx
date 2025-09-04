import { useState, useEffect } from "react";
interface PomodoroTimerProps {
  taskId: string;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ taskId }) => {
  const STORAGE_KEY = `pomodoro_${taskId}`;

  const [secondsLeft, setSecondsLeft] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_time`);
    return saved ? parseInt(saved, 10) : 25 * 60;
  });

  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_running`);
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_time`, secondsLeft.toString());
    localStorage.setItem(`${STORAGE_KEY}_running`, isRunning.toString());
  }, [secondsLeft, isRunning]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  return (
    <div className="pomodoro-timer">
      {/* <h4>Pomodoro for Task: {taskId}</h4> */}
      {/* <div className="timer-display">{formatTime(secondsLeft)}</div> */}
      <h2>Timer: {formatTime(secondsLeft)}</h2>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};
