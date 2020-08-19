export type Seed = bigint;

export type ActionResult = 'correct' | 'incorrect' | 'pending'

export interface PuzzleProps<Instance extends {}, Action extends {}> {
  instance: Instance;
  done: boolean;
  onAction: (action: Action) => ActionResult;
}

export interface RulesProps<Rules extends {}> {
  rules: Rules;
}

export interface Puzzle<Instance extends {}, Rules extends {}, Action extends {}> {
  genPuzzle: (ruleSeed: Seed, instanceSeed: Seed) => Instance;
  genRules: (ruleSeed: Seed) => Rules;
  renderPuzzle: (props: PuzzleProps<Instance, Action>) => JSX.Element;
  renderRules: (props: RulesProps<Rules>) => JSX.Element;
  checkAction: (action: Action, rules: Rules, instance: Instance) => ActionResult;
  name: string;
}

export interface PuzzleComponentProps<I, R, A> {
  puzzle: Puzzle<I, R, A>;
  onSuccess: () => void;
  onFailure: () => void;
  ruleSeed: Seed;
  instanceSeed: Seed;
}
