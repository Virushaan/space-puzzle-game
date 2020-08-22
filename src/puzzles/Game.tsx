import React, { useState } from "react";
import { Seed, Puzzle } from "./types";
import { SeededRandom } from "../maths/random";
import { ABPuzzle } from "./ABPuzzle";
import { ConnectionPuzzle } from "./ConnectionPuzzle/ConnectionPuzzle";
import { PuzzleComponent } from "./Puzzle";
import { PairsPuzzle } from "./PairsPuzzle/PairsPuzzle";

interface PuzzleData {
  instanceSeed: Seed;
  puzzle: Puzzle<any, any, any>;
  complete: boolean;
}

interface Props {
  ruleSeed: Seed;
  gameSeed: Seed;
}

const makePuzzle = (puzzle: Puzzle<any, any, any>, rand: SeededRandom) => ({
  instanceSeed: rand.nextBigInt(),
  puzzle,
  complete: false
});

const pickPuzzles = (gameSeed: Seed): PuzzleData[] => {
  const rand = new SeededRandom(gameSeed);

  return [
    makePuzzle(PairsPuzzle, rand),
    makePuzzle(ABPuzzle, rand),
    makePuzzle(ConnectionPuzzle, rand),
    makePuzzle(ConnectionPuzzle, rand),
    makePuzzle(ConnectionPuzzle, rand),
  ];
}

export const Game = ({
  ruleSeed,
  gameSeed,
}: Props) => {
  const [errors, setErrors] = useState(3);
  const [puzzles, setPuzzles] = useState(pickPuzzles(gameSeed));

  const onSuccess = (puzzleIndex: number) => () => {
    setPuzzles(puzzles.map(({ instanceSeed, puzzle, complete }, index) => ({
      instanceSeed,
      puzzle,
      complete: puzzleIndex === index ? true : complete,
    })));
  };

  const onFailure = () => {
    setErrors(errors - 1);
  };

  const numIncomplete = puzzles.filter(({ complete }) => !complete).length;

  return (
    <header className="App-header">
      <div>Incomplete {numIncomplete} Lives {errors}</div>
      <div>
        {puzzles.map(({ puzzle, instanceSeed }, index) => (
          <PuzzleComponent
            key={instanceSeed.toString()}
            puzzle={puzzle}
            onSuccess={onSuccess(index)}
            onFailure={onFailure}
            ruleSeed={ruleSeed}
            instanceSeed={instanceSeed}
          />
        ))}
      </div>
    </header>
  );
}
