import seedrandom from "seedrandom";

const randomInt = (n = 100000000): number => {
  return Math.floor(Math.random() * n);
}

export const generateSeed = (): bigint => {
  return BigInt(`${randomInt()}${randomInt()}${randomInt()}`);
}

export class SeededRandom {

  private engine: seedrandom.prng

  constructor(ruleSeed: bigint, instanceSeed = BigInt(0)) {
    this.engine = seedrandom(`${ruleSeed}${instanceSeed}`)
  }

  nextDouble(): number {
    return this.engine()
  }

  nextInt(max: number): number {
    return Math.floor(this.engine() * max)
  }
}

export const seededShuffle = <T>(seed: bigint, array: T[]): T[] => {
  const rand = new SeededRandom(seed)

  for (let i = array.length - 1; i > 0; i--) {
    let j = rand.nextInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  
  return array;
}
