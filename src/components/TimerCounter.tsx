import { useEffect, useRef, useState } from "react";
import { Timer } from "../types";
import Button from "./Button";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";

const formatMillis = (millis: number) => {
  const formater = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  })

  return formater.format(millis);
}

// @ts-ignore
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const TimerCounter = ({ timer }: { timer: Timer }) => {
  const [currentMillis, setCurrentMillis] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const offsets = timer?.offset?.includes('/') ? timer?.offset.split('/') : [timer?.offset];

  const currentOffset = offsets[offsets.length - 1];
  const offsetValue = parseInt(currentOffset);

  const handlePlay = () => {
    if (isPlaying) return;

    setIsPlaying(true);
    previousTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(count);
  };

  const handleStop = () => {
    setIsPlaying(false);
    cancelAnimationFrame(requestRef.current);
    setCurrentMillis(0);
    accumulatedTimeRef.current = 0;
  };

  const count = (time: number) => {
    if (previousTimeRef.current === 0) {
      previousTimeRef.current = time;
    }

    const delta = time - previousTimeRef.current;

    previousTimeRef.current = time;

    const beeps = offsets.map((offset) => {
      return Array.from({ length: timer.beeps }).map((_, i) => {
        return parseInt(offset) - timer.interval * i;
      })
    }).flat().filter((value, index, array) => array.indexOf(value) === index);

    setCurrentMillis(prev => {
      const newMillis = prev + delta;

      for (const b of beeps) {
        // is between range of 10ms
        if (newMillis >= b - 10 && newMillis <= b) {
          console.log('beep');
          beep();
        }
      }

      if (newMillis >= offsetValue) {
        handleStop();
        return offsetValue;
      }

      return newMillis;
    });

    if (currentMillis < offsetValue) {
      requestRef.current = requestAnimationFrame(count);
    }
  };

  useEffect(() => {

    const init = async () => {

      await register('CommandOrControl+Shift+C', (event) => {
        if (event.state === 'Released') {
          if (isPlaying) {

            setCurrentMillis(0);
            accumulatedTimeRef.current = 0;
          }
          handlePlay();

        }
      });
    }

    init();
    return () => {
      unregister('CommandOrControl+Shift+C');
    }
  }, [isPlaying]);

  useEffect(() => {


    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const beep = async (path: string = '/blipSelect.mp3') => {

    const source = audioContext.createBufferSource();
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }

  if (currentMillis === undefined) {
    return <div className="text-3xl text-red-500">error</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-28">
      <div className="text-3xl font-bold">
        {currentOffset ? formatMillis((parseInt(currentOffset) - currentMillis) / 1000) : "0.000"}
      </div>

      <Button onClick={handlePlay}>
        Play
      </Button>

      <Button onClick={handleStop}>
        Stop
      </Button>
    </div>
  );
};

export default TimerCounter;
