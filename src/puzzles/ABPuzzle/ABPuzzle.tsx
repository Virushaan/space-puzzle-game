import React from "react";
import { Puzzle, Seed } from "../types";

export interface ABRule {
  value: boolean;
}

export const ABPuzzle: Puzzle<null, ABRule> = {
  name: "ABPuzzle",

  genPuzzle: (ruleSeed: Seed, instanceSeed: Seed) => {
    return null;
  },

  genRule: (ruleSeed: Seed): ABRule => {
    const example: ABRule = { value: true };
    return example;
  },

  renderPuzzle: (instance: null): JSX.Element => {
    return (
      <div>
        <button>A</button>
        <button>B</button>
      </div>
    );
  },

  renderRules: (rules: ABRule): JSX.Element => {
    return <div></div>;
  },
};
