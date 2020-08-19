import React, { useState, useEffect } from "react";
import { PuzzleComponentProps } from "./types";

export const PuzzleComponent = <I, R, A>({
  puzzle,
  onSuccess,
  onFailure,
  ruleSeed,
  instanceSeed
}: PuzzleComponentProps<I, R, A>) => {
  const [instance] = useState(puzzle.genPuzzle(ruleSeed, instanceSeed));
  const [rules] = useState(puzzle.genRules(ruleSeed));
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    console.log(rules);
  }, [rules]);

  const Element = puzzle.renderPuzzle;
  const Rules = puzzle.renderRules;

  const onAction = (action: A) => {
    if (complete) {
      return 'pending';
    }
    const result = puzzle.checkAction(action, rules, instance);
    if (result === 'correct') {
      setComplete(true);
      onSuccess();
    } else if (result === 'incorrect') {
      onFailure();
    }

    return result;
  }

  return (
    <div className={`puzzle ${complete ? 'done' : ''}`}>
      <Element
        instance={instance}
        done={complete}
        onAction={onAction}
      />
      <Rules rules={rules} />
    </div>
  );
}
