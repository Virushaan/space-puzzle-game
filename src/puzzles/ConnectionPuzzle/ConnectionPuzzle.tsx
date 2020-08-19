import React, { useEffect, useState } from "react";
import { Puzzle, PuzzleProps, ActionResult } from "../types";
import { SeededRandom, seededShuffle } from "../../maths/random";

interface Instance {
  // Should be 8 long array
  lights: boolean[];
}

type Solution = number[];

interface Condition {
  required: number[];
  solution: Solution;
}

interface Action {
  pressed: Solution;
}

interface Rules {
  conditions: Condition[];
}

type Props = PuzzleProps<Instance, Action>;

const names = 'HULL SHIELDS ENGINE THRUST OXYGEN FLUIDS SOLAR BATTERY'.split(' ')

interface ButtonProps {
  lit: boolean;
  index: number;
  onClick: () => void;
  disabled: boolean;
  pressed: boolean;
}

const LittleButton = ({
  lit,
  index,
  onClick,
  disabled,
  pressed,
}: ButtonProps) => (
  <button
    onClick={onClick}
    className={`connection-button ${lit ? 'lit' : ''} ${pressed ? 'pressed' : ''}`}
    disabled={disabled}
  >
    {names[index]}
  </button>
);

const RenderPuzzle = ({
  instance,
  onAction,
  done
}: Props): JSX.Element => {
  const [pressed, setPressed] = useState<boolean[]>(Array(names.length).fill(false));

  useEffect(() => {
    const action = {
      pressed: pressed.map((value, index) =>
        value ? index : -1
      ).filter(value => value >= 0),
    };
    console.log(action);
    const result = onAction(action);
    if (result === 'incorrect') {
      setPressed(Array(names.length).fill(false));
    }
  }, [pressed]);

  const onClicker = (id: number) => () => {
    setPressed(
      pressed.map((value, index) => index === id ? !value : value),
    );
  }

  return (
    <div className="connection-puzzle">
      {instance.lights.map((value, index) => (
        <LittleButton
          key={index}
          index={index}
          lit={value}
          onClick={onClicker(index)}
          disabled={done}
          pressed={pressed[index]}
        />
      ))}
    </div>
  )
}

export const ConnectionPuzzle: Puzzle<Instance, Rules, Action> = {
  name: "Connection Puzzle",
  genPuzzle: (ruleSeed, instanceSeed) => {
    const rand = new SeededRandom(ruleSeed, instanceSeed);

    return {
      lights: Array(8).fill(0).map(() => rand.nextDouble() < 0.3)
    };
  },
  genRules: ruleSeed => {
    const rand = new SeededRandom(ruleSeed);

    const order = seededShuffle(ruleSeed, [0, 1, 2, 3, 4, 5, 6, 7, rand.nextInt(8)]);

    const newCondition = (count: number): Condition => {
      const first = rand.nextInt(8);
      const second = (first + rand.nextInt(7)) % 8;
      return {
        required: order.splice(0, count),
        solution: [first, second].sort() as [number, number]
      };
    };

    return {
      conditions: [3, 2, 2, 1, 1, 0].map(newCondition)
    };
  },
  renderPuzzle: RenderPuzzle,
  renderRules: ({ rules }) => (
    <div className="connection-rules">
      {rules.conditions.map((condition) => {
        return (
          <div>
            Required: {condition.required.map(num => names[num]).join(' or ')}
            Then: {condition.solution.map(num => names[num]).join()}
          </div>
        )
      })}
    </div>
  ),
  checkAction: ({ pressed }, { conditions }, instance) => {
    const checkMatch = (pressed: Solution, solution: Solution): ActionResult => {
      const matching = pressed.every(value => solution.includes(value));

      if (!matching) {
        return 'incorrect';
      } else if (pressed.length < solution.length) {
        return 'pending';
      } else {
        return 'correct';
      }
    }

    for (const { required, solution } of conditions) {
      if (required.length === 0
        || required.some(value => instance.lights[value])) {
        return checkMatch(pressed, solution);
      }
    }

    const last = conditions[conditions.length - 1];
    return checkMatch(pressed, last.solution);
  },
}
