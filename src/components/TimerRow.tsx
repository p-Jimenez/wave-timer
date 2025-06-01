import { Timer } from "../types";
import Button from "./Button";
import Input from "./Input";

const TimerRow = ({
  timer,
  active,
  onTimerSelected,
  onTimerChanged,
  onTimerDeleted
}: {
  timer: Timer,
  active?: boolean,
  onTimerSelected: (timer: Timer) => void,
  onTimerChanged: (timer: Timer) => void,
  onTimerDeleted: (timer: Timer) => void
}) => {
  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <input type="radio" checked={active} name="timer" onChange={() => onTimerSelected(timer)} />
      <Input value={timer.name} onChange={(e) => onTimerChanged({ ...timer, name: e.target.value })} />
      <Input value={timer.offset} onChange={(e) => onTimerChanged({ ...timer, offset: e.target.value })} />
      <Input type="number" value={timer.interval} onChange={(e) => onTimerChanged({ ...timer, interval: parseInt(e.target.value) })} />
      <Input type="number" value={timer.beeps} onChange={(e) => onTimerChanged({ ...timer, beeps: parseInt(e.target.value) })} />
      <Button onClick={() => onTimerDeleted(timer)}>
        -
      </Button>
    </div>
  );
};

export default TimerRow;
