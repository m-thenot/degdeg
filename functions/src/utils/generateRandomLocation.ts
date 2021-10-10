// Generate n random cars

const getRandomInRange = (from: number, to: number, fixed: number): number => {
  return Number((Math.random() * (to - from) + from).toFixed(fixed));
};

export const generateRandomLocation = (length: number) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push({
      latitude: getRandomInRange(48.7, 49, 6),
      longitude: getRandomInRange(2.2, 2.5, 6),
    });
  }
  return arr;
};
