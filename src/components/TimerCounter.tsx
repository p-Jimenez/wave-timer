import { useState } from "react";
import { Timer } from "../types";

const formatMillis = (millis: number) => {
  const formater = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3
  })

  return formater.format(millis);
}

const TimerCounter = ({ timer }: { timer: Timer }) => {

  const [currentMillis, setCurrentMillis] = useState(0);

  const offsets = timer?.offset?.includes('/') ? timer?.offset.split('/') : [timer?.offset];

  const currentOffset = offsets.find((offset) => {
    if (currentMillis < parseInt(offset)) {
      return true;
    }
  });

  if (currentMillis === undefined) {
    return <div className="text-3xl text-red-500">error</div>;
  }

  return <div className="text-3xl font-bold">
    {formatMillis((parseInt(currentOffset) - currentMillis) / 1000)}
  </div>;
};

export default TimerCounter;
