export const getRandomIntNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export function takeRandomArrayItem<T = unknown>(arr: T[]) {
  const index = getRandomIntNumber(0, arr.length)
  return arr[index]
}
