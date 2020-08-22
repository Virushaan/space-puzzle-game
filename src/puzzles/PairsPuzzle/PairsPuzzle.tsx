import React, { useState, useEffect } from "react";
import { Puzzle, Seed, PuzzleProps, RulesProps } from "../types";
import { seededShuffle, SeededRandom } from "../../maths/random";
import "./puzzle.css";

type Word = string;
type PartialPair = [Word, Word | undefined];

interface Instance {
  words: Word[];
}

const words: Word[] =
  'which there their about would these other words could write first water after where right think three years place sound great again still every small found those never under might while house world below asked going large until along shall being often earth began since study night light above paper parts young story point times heard whole white given means'.split(' ');
// for (let i = 0; i < 50; i++) {
//   words.push(i.toString());
// }

export interface Rules {
  wordGrid: Word[];
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
      setPressed(pressed.slice(1));
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

const GridItem = ({ word }: { word: Word }) => {
  const [active, setActive] = useState(false);

  const onClick = () => {
    setActive(!active);
  }

  return (
    <div className={active ? 'active' : ''} onClick={onClick}>{word}</div>
  );
}

const renderRules = ({
  rules,
}: RulesProps<Rules>): JSX.Element => {
  return (
    <div className="pairs-rules">
      {rules.wordGrid.map((word) => <GridItem word={word} />)}
    </div>
  );
}

const getWords = (ruleSeed: Seed) => {
  const myWords = words.slice();
  return seededShuffle(ruleSeed, myWords).slice(0, 20);
}

const NUM_PAIRS_IN_INSTANCE = 4;
const NUM_WORDS_IN_INSTANCE = NUM_PAIRS_IN_INSTANCE * 2;
const ROWS = 4;
const COLS = 5;

const rowAndColumn = (
  index: number
): { row: number, column: number } => ({
  row: Math.floor(index / ROWS),
  column: index % COLS,
});

function choice<T>(rand: SeededRandom, list: T[]) {
  return list[rand.nextInt(list.length)];
}

const makePairs = (
  ruleSeed: Seed,
  instanceSeed: Seed,
  wordGrid: Word[]
): Word[] => {
  const rand = new SeededRandom(ruleSeed, instanceSeed)
  const words: Word[] = [];

  while (words.length < NUM_WORDS_IN_INSTANCE) {
    const [first, index] = choice(
      rand,
      wordGrid
        .map<[Word, number]>((word, index) => [word, index])
        .filter(([word]) => !words.includes(word)),
    );

    const { row, column } = rowAndColumn(index);
    const neighbours = wordGrid.filter((word, index) => {
      const { row: thisRow, column: thisColumn } = rowAndColumn(index);
      // Only allow words we haven't seen and words in the same row XOR column
      return !words.includes(word)
        && ((thisRow === row) !== (thisColumn === column));
    });

    const second = choice(rand, neighbours);

    if (second) {
      words.push(first, second);
    }
  }

  seededShuffle(instanceSeed, words);

  return words;
}

export const PairsPuzzle: Puzzle<Instance, Rules, Action> = {
  name: "Pairs Puzzle",

  genPuzzle: (ruleSeed: Seed, instanceSeed: Seed) => {
    const words = getWords(ruleSeed);

    return {
      words: makePairs(ruleSeed, instanceSeed, words),
    };
  },

  genRules: (ruleSeed: Seed): Rules => {
    const words = getWords(ruleSeed);
    
    return {
      wordGrid: words,
    }
  },

  renderPuzzle: RenderPuzzle,
  renderRules,

  checkAction: ({ pairs }: Action, { wordGrid }: Rules) => {
    if (pairs.length === 0) {
      return 'pending';
    }

    const failed = pairs.some(([first, second]) => {
      if (!second) return false;
      const { row: rowA, column: colA } = rowAndColumn(wordGrid.indexOf(first));
      const { row: rowB, column: colB } = rowAndColumn(wordGrid.indexOf(second));

      return rowA !== rowB && colA !== colB;
    });

    if (failed) {
      return 'incorrect';
    }

    function wordCheck(word: Word | undefined): word is string {
      return !!word;
    }

    const allWords = pairs
      .reduce((list, [a, b]) => list.concat(a, b), [] as (Word | undefined)[])
      .filter<Word>(wordCheck);

    if (allWords.length === NUM_WORDS_IN_INSTANCE) {
      return 'correct';
    }

    return 'pending';
  },
};
