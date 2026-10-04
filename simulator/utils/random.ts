export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDelay(min = 50, max = 300): number {
  return randomInt(min, max);
}