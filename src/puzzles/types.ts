export interface Puzzle<Instance, Rule> {
  genPuzzle: (ruleSeed: Seed, instanceSeed: Seed) => Instance;
  genRule: (ruleSeed: Seed) => Rule;
  renderPuzzle: (instance: Instance) => JSX.Element;
  renderRules: (rules: Rule) => JSX.Element;
  name: string;
}

export type Seed = number;