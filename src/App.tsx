import React from "react";
import "./App.css";
import { Game } from "./puzzles/Game";

const ruleSeed = BigInt(157429781223);
const gameSeed = BigInt(73237824);

function App() {
  return (
    <Game ruleSeed={ruleSeed} gameSeed={gameSeed} />
  );
}

export default App;
