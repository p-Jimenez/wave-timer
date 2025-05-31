import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Timer } from "./types";
import TimerRow from "./components/TimerRow";
import { ErrorBoundary } from "react-error-boundary";
import TimerCounter from "./components/TimerCounter";



const defaultTimer: Timer = {
  id: crypto.randomUUID(),
  name: "Timer",
  offset: "10132/20000",
  interval: 500,
  beeps: 5,
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [timers, setTimers] = useState<Timer[]>([]);

  const [timerIndex, setTimerIndex] = useState(0);

  useEffect(() => {
    if (timers.length === 0) {
      const timer2 = { ...defaultTimer, id: crypto.randomUUID() };
      const timer3 = { ...defaultTimer, id: crypto.randomUUID() };
      setTimers([defaultTimer, timer2, timer3]);
    }
  }, [])

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  const handleTimerSelected = (timer: Timer) => {
    setTimerIndex(timers.indexOf(timer));
  }

  const handleTimerChanged = (timer: Timer) => {
    const timersCopy = [...timers];
    const originalTimer = timers.find((t) => t.id === timer.id);

    if (!originalTimer) {
      return;
    }

    const index = timers.indexOf(originalTimer);
    timersCopy[index] = timer;
    setTimers(timersCopy);
  }

  const handleTimerDeleted = (timer: Timer) => {
    const timersCopy = [...timers];
    const index = timers.indexOf(timer);
    timersCopy.splice(index, 1);
    setTimers(timersCopy);
  }

  return (
    <div className="h-screen flex justify-center items-center gap-4">

      <ErrorBoundary fallback={<span>error </span>}>
        <TimerCounter timer={timers[timerIndex]} />
      </ErrorBoundary>
      <div>
        {timers.map((timer) => <TimerRow
          key={timer.id}
          timer={timer}
          onTimerSelected={handleTimerSelected}
          onTimerChanged={handleTimerChanged}
          onTimerDeleted={handleTimerDeleted}
        />)}
      </div>

    </div>
  );
}

export default App;
