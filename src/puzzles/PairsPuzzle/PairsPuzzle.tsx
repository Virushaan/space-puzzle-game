import React, { useState, useEffect } from "react";
import { Puzzle, Seed, PuzzleProps, RulesProps } from "../types";
import { seededShuffle } from "../../maths/random";
import "./puzzle.css";

type Word = string;
type Pair = [Word, Word];
type PartialPair = [Word, Word | undefined];

interface Instance {
  words: Word[];
}

const words: Word[] = [];
for (let i = 0; i < 50; i++) {
  words.push(i.toString());
}

export interface Rules {
  words: Word[];
  pairs: Pair[];
}

export interface Action {
  pairs: PartialPair[];
}

type Props = PuzzleProps<Instance, Action>;

const RenderPuzzle = ({
  onAction,
  done,
  instance
}: Props): JSX.Element => {

  const [pressed, setPressed] = useState<Action["pairs"]>([]);

  useEffect(() => {
    const action = {
      pairs: pressed,
    };
    const result = onAction(action);
    if (result === 'incorrect') {
      // Something bad happened!
      // Clear last pair?
    }
  }, [pressed, onAction]);

  const onClick = (word: Word) => () => {
    if (done) return;
    const currentPair = pressed[0];
    if (!currentPair) {
      setPressed([
        [word, undefined],
      ]);
    } else if (!currentPair[1]) {
      if (currentPair[0] === word) {
        // Clicking only unconfirmed word
        setPressed([
          ...pressed.slice(1),
        ]);
      } else {
        setPressed([
          [currentPair[0], word],
          ...pressed.slice(1),
        ]);
      }
    } else {
      setPressed([
        [word, undefined],
        ...pressed,
      ]);
    }
  };

  const isWordUsed = (word: Word) =>
    pressed.some(([a, b]) => !!b && [a, b].includes(word));

  const isWordActive = (word: Word) =>
    !!pressed[0] && !pressed[0][1] && pressed[0][0] === word;

  return (
    <div className="pairs-puzzle">
      {instance.words.map(word => (
        <button
          key={word}
          disabled={done || isWordUsed(word)}
          onClick={onClick(word)}
          className={
            isWordUsed(word)
              ? "done"
              : isWordActive(word)
                ? "active"
                : "unused"
          }
        >
          {word}
        </button>
      ))}
    </div>
  );
}

const renderRules = ({
  rules,
}: RulesProps<Rules>): JSX.Element => {
  return (
    <div>
      {rules.pairs.map(([wordA, wordB]) => (
        <div>[{wordA}, {wordB}]</div>
      ))}
    </div>
  );
}

function id<T>(x: T) {
  return x;
}

const getWords = (ruleSeed: Seed) => {
  const myWords = words.map(id);
  return seededShuffle(ruleSeed, myWords);
}

export const PairsPuzzle: Puzzle<Instance, Rules, Action> = {
  name: "Pairs Puzzle",

  genPuzzle: (gameSeed: Seed, ruleSeed: Seed) => {
    const words = getWords(ruleSeed);
    
    seededShuffle(gameSeed, words);

    return {
      words: words.splice(0, 8)
    };
  },

  genRules: (ruleSeed: Seed): Rules => {
    const words = getWords(ruleSeed);
    
    return {
      words,
      pairs: []
    }
  },

  renderPuzzle: RenderPuzzle,
  renderRules,

  checkAction: (a: Action, rules: Rules) => {
    return 'pending';
    //if (value === rules.value) {
    //  return 'correct'
    //} else {
    //  return 'incorrect'
    //}
  }
};
