// import { useEffect, useRef, useState } from "react";
// import { startTime, stopTime, resetTime, endTime, getTimerByTodo, updateTodo } from "../services/Apl";
// import { getTodos } from "../services/Apl";
// interface TimerData {
//   _id: string;
//   todoId: string;
//   workspace?: string;
//   startedAt: string | null;
//   stoppedAt: string | null;
//   totalDuration: number;
//   isRunning: boolean;
//   isEnded: boolean;
// }

// interface Props {
//   todoId: string;
//   workspace: string;
//   refreshTodos: () => Promise<void>;
//   status:string
// }

// const formatTime = (seconds: number) => {
//   const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
//   const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
//   const s = String(seconds % 60).padStart(2, "0");
//   return `${h}:${m}:${s}`;
// };

// export default function PomodoroTimer({ todoId, workspace,refreshTodos  }: Props) {
//   const [timer, setTimer] = useState<TimerData | null>(null);
//   const [elapsed, setElapsed] = useState(0);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   // Fetch timer on mount/refresh
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getTimerByTodo(todoId);
//         setTimer(res.data);

//         if (res.data.isRunning && res.data.startedAt) {
//           const start = new Date(res.data.startedAt).getTime();
//           setElapsed(res.data.totalDuration + Math.floor((Date.now() - start) / 1000));
//           startInterval();
//         } else {
//           setElapsed(res.data.totalDuration);
//         }
//       } catch (err) {
//         console.log("No existing timer");
//       }
//     })();

//     return () => clearInterval(intervalRef.current!);
//   }, [todoId]);

//   const startInterval = () => {
//     clearInterval(intervalRef.current!);
//     intervalRef.current = setInterval(() => {
//       setElapsed((prev) => prev + 1);
//     }, 1000);
//   };

//   const workspaceId=workspace;
//   // Actions
//   const handleStart = async () => {
//     try {
//       const res = await startTime(todoId);
//       setTimer(res.data);

//       // ✅ Update todo status -> In Progress
//       await updateTodo(todoId, { status: "InProgress" }, workspaceId);

//       if (res.data.isRunning) startInterval();
//       refreshTodos();
//     //   await getTodos(workspaceId);
//     } catch (err) {
//       console.error("Error starting timer:", err);
//     }
//   };

//   const handleStop = async () => {
//     if (!timer?._id) return;
//     try {
//       const res = await stopTime(timer._id);
//       setTimer(res.data);
//       clearInterval(intervalRef.current!);
//     } catch (err) {
//       console.error("Error stopping timer:", err);
//     }
//   };

//   const handleReset = async () => {
//     if (!timer?._id) return;
//     try {
//       const res = await resetTime(timer._id);
//       setTimer(res.data);
//       setElapsed(0);
//       clearInterval(intervalRef.current!);
//     } catch (err) {
//       console.error("Error resetting timer:", err);
//     }
//   };

//   const handleEnd = async () => {
//     if (!timer?._id) return;
//     try {
//       const res = await endTime(timer._id);
//       clearInterval(intervalRef.current!);
//       setElapsed(res.totalTimeSeconds);

//       // ✅ Update todo status -> Completed
//       await updateTodo(todoId, { status: "Completed" }, workspaceId);

//       setTimer((prev) =>
//         prev ? { ...prev, isEnded: true, isRunning: false } : null
//       );
//       refreshTodos();
//     //   await getTodos(workspaceId);
//     } catch (err) {
//       console.error("Error ending timer:", err);
//     }
//   };

//   // UI
//   if (timer?.isEnded) {
//     return (
//       <div className="p-4 border rounded w-64 text-center">
//         <h3 className="text-lg font-bold">Pomodoro Timer</h3>
//         <p className="text-xl mt-4">✅ Total Time Taken</p>
//         <p className="text-2xl font-mono">{formatTime(elapsed)}</p>
//         {/* <p className="text-sm text-gray-500 mt-2">Status: Completed</p> */}
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 border rounded w-64 text-center">
//       <h3 className="text-lg font-bold">Pomodoro Timer</h3>
//       <p className="text-2xl font-mono my-4">{formatTime(elapsed)}</p>

//       <div className="flex gap-2 justify-center">
//         {!timer?.isRunning ? (
//           <button
//             onClick={handleStart}
//             className="px-3 py-1 bg-green-500 text-white rounded"
//           >
//             Start
//           </button>
//         ) : (
//           <button
//             onClick={handleStop}
//             className="px-3 py-1 bg-yellow-500 text-white rounded"
//           >
//             Stop
//           </button>
//         )}
//         <button
//           onClick={handleReset}
//           className="px-3 py-1 bg-blue-500 text-white rounded"
//         >
//           Reset
//         </button>
//         <button
//           onClick={handleEnd}
//           className="px-3 py-1 bg-red-500 text-white rounded"
//         >
//           End
//         </button>
//       </div>

//       {/* <p className="text-sm text-gray-500 mt-2">
//         Status:{" "}
//         {timer?.isRunning
//           ? "In Progress"
//           : timer?.isEnded
//           ? "Completed"
//           : "Pending"}
//       </p> */}
//     </div>
//   );
// }






















import { useEffect, useRef, useState } from "react";
import { startTime, stopTime, resetTime, endTime, getTimerByTodo, updateTodo } from "../services/Apl";

interface TimerData {
  _id: string;
  todoId: string;
  workspace?: string;
  startedAt: string | null;
  stoppedAt: string | null;
  totalDuration: number;
  isRunning: boolean;
  isEnded: boolean;
}

interface Props {
  todoId: string;
  workspace: string;
  refreshTodos: () => Promise<void>;
  status: string; // Pending | InProgress | Completed
}

const formatTime = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export default function PomodoroTimer({ todoId, workspace, refreshTodos, status }: Props) {
  const [timer, setTimer] = useState<TimerData | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const workspaceId = workspace;

  // Fetch timer on mount/refresh
  useEffect(() => {
    (async () => {
      try {
        const res = await getTimerByTodo(todoId);
        setTimer(res.data);

        if (res.data.isRunning && res.data.startedAt) {
          const start = new Date(res.data.startedAt).getTime();
          setElapsed(res.data.totalDuration + Math.floor((Date.now() - start) / 1000));
          startInterval();
        } else {
          setElapsed(res.data.totalDuration);
        }
      } catch (err) {
        console.log("No existing timer");
      }
    })();

    return () => clearInterval(intervalRef.current!);
  }, [todoId]);

  // Auto-start timer when status becomes InProgress
  useEffect(() => {
    if (status === "InProgress" && timer && !timer.isRunning && !timer.isEnded) {
      handleStart();
    }
  }, [status, timer]);

  const startInterval = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  // Actions
  const handleStart = async () => {
    try {
      const res = await startTime(todoId);
      setTimer(res.data);

      // Update todo status to InProgress only if not already
      if (status !== "InProgress") {
        await updateTodo(todoId, { status: "InProgress" }, workspaceId);
      }

      if (res.data.isRunning) startInterval();
      
    await refreshTodos();
    } catch (err) {
      console.error("Error starting timer:", err);
    }
  };

  const handleStop = async () => {
    if (!timer?._id) return;
    try {
      const res = await stopTime(timer._id);
      setTimer(res.data);
      clearInterval(intervalRef.current!);
    } catch (err) {
      console.error("Error stopping timer:", err);
    }
  };

  const handleReset = async () => {
    if (!timer?._id) return;
    try {
      const res = await resetTime(timer._id);
      setTimer(res.data);
      setElapsed(0);
      clearInterval(intervalRef.current!);
    } catch (err) {
      console.error("Error resetting timer:", err);
    }
  };

  const handleEnd = async () => {
    if (!timer?._id) return;
    try {
      const res = await endTime(timer._id);
      clearInterval(intervalRef.current!);
      setElapsed(res.totalTimeSeconds);

      // Update todo status to Completed
      await updateTodo(todoId, { status: "Completed" }, workspaceId);

      setTimer((prev) =>
        prev ? { ...prev, isEnded: true, isRunning: false } : null
      );
      refreshTodos();
    } catch (err) {
      console.error("Error ending timer:", err);
    }
  };

  // UI
  if (timer?.isEnded) {
    return (
      <div className="p-4 border rounded w-64 text-center">
        <h3 className="text-lg font-bold">Pomodoro Timer</h3>
        <p className="text-xl mt-4">✅ Total Time Taken</p>
        <p className="text-2xl font-mono">{formatTime(elapsed)}</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded w-64 text-center">
      <h3 className="text-lg font-bold">Pomodoro Timer</h3>
      <p className="text-2xl font-mono my-4">{formatTime(elapsed)}</p>

      <div className="flex gap-2 justify-center">
        {!timer?.isRunning ? (
          <button
            onClick={handleStart}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Reset
        </button>
        <button
          onClick={handleEnd}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          End
        </button>
      </div>
    </div>
  );
}
