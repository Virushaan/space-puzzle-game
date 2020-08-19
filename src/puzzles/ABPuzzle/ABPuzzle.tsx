import React from "react";
import { Puzzle, Seed, PuzzleProps, RulesProps } from "../types";

interface ABInstance {}

export interface ABRule {
  value: boolean;
}

export interface ABAction {
  value: boolean;
}

type Props = PuzzleProps<ABInstance, ABAction>;

const renderPuzzle = ({
  onAction,
  done
}: Props): JSX.Element => {

  const onClick = (buttonName: string) => () => {
    if (done) return;
    onAction({
      value: buttonName === 'a'
    });
  };

  return (
    <div>
      <button disabled={done} onClick={onClick('a')}>A</button>
      <button disabled={done} onClick={onClick('b')}>B</button>
    </div>
  );
}

const renderRules = ({
  rules,
}: RulesProps<ABRule>): JSX.Element => {
  return (
    <div>{rules.value ? 'A' : 'B'}</div>
  );
}

export const ABPuzzle: Puzzle<ABInstance, ABRule, ABAction> = {
  name: "ABPuzzle",

  genPuzzle: (_: Seed, __: Seed) => {
    return {};
  },

  genRules: (ruleSeed: Seed): ABRule => ({
    value: (ruleSeed % BigInt(2)) === BigInt(1)
  }),

  renderPuzzle,
  renderRules,

  checkAction: ({ value }: ABAction, rules: ABRule) => {
    if (value === rules.value) {
      return 'correct'
    } else {
      return 'incorrect'
    }
  }
};
