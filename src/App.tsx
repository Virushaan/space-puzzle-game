import React, { useState } from "react";
import "./App.css";
import { ABPuzzle } from "./puzzles";
import { PuzzleComponent } from "./puzzles/Puzzle";
import { ConnectionPuzzle } from "./puzzles/ConnectionPuzzle/ConnectionPuzzle";

const ruleSeed = BigInt(1235125415);
const instanceSeed = BigInt(15237824);

function App() {
  const [errors, setErrors] = useState(3);
  const [incomplete, setIncomplete] = useState(2);

  const onSuccess = () => {
    setIncomplete(incomplete - 1);
  }

  const onFailure = () => {
    setErrors(errors - 1);
  }

  return (
    <header className="App-header">
      <div>Incomplete {incomplete} Errors {errors}</div>
      <PuzzleComponent
        puzzle={ABPuzzle}
        onSuccess={onSuccess}
        onFailure={onFailure}
        ruleSeed={ruleSeed}
        instanceSeed={instanceSeed}
      />
      <PuzzleComponent
        puzzle={ConnectionPuzzle}
        onSuccess={onSuccess}
        onFailure={onFailure}
        ruleSeed={ruleSeed}
        instanceSeed={instanceSeed}
      />
    </header>
  );
}

export default App;
