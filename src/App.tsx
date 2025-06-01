import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Timer } from "./types";
import TimerRow from "./components/TimerRow";
import { ErrorBoundary } from "react-error-boundary";
import TimerCounter from "./components/TimerCounter";
import Button from "./components/Button";
import { getCurrentWindow } from '@tauri-apps/api/window';

const defaultTimer: Timer = {
  id: crypto.randomUUID(),
  name: "Timer",
  offset: "10000/15000",
  interval: 500,
  beeps: 5,
}

getCurrentWindow().setAlwaysOnTop(true);

function App() {

  const [currentMillis, setCurrentMillis] = useState(0);
  const [timers, setTimers] = useState<Timer[]>([]);
  const [timerIndex, setTimerIndex] = useState(0);

  const intervalRef = useRef(0);

  useEffect(() => {
    if (timers.length === 0) {
      const timer2 = { ...defaultTimer, id: crypto.randomUUID() };
      const timer3 = { ...defaultTimer, id: crypto.randomUUID() };
      setTimers([defaultTimer, timer2, timer3]);
    }
  }, [])

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await invoke("greet", { name: "test" });
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

  const handleTimerAdded = () => {
    setTimers([...timers, { ...defaultTimer, id: crypto.randomUUID() }]);
  }


  return (
    <div className="h-screen flex justify-center items-center gap-4 bg-white dark:bg-gray-900 dark:text-white">

      <ErrorBoundary fallback={<span>error </span>}>
        <TimerCounter
          timer={timers[timerIndex]}
        />
      </ErrorBoundary>

      <div>
        {timers.map((timer) => <TimerRow
          key={timer.id}
          timer={timer}
          active={timerIndex === timers.indexOf(timer)}
          onTimerSelected={handleTimerSelected}
          onTimerChanged={handleTimerChanged}
          onTimerDeleted={handleTimerDeleted}
        />)}
        <Button className="ms-7 mt-2" onClick={handleTimerAdded}>
          Add
        </Button>
      </div>

    </div>
  );
}

export default App;
