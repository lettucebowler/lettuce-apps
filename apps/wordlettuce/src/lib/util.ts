export function mulberry(a: number) {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function getGameStatus({ appName, gameNum, answers }: { appName: string; answers: string[]; gameNum: number }) {
  const today = `${appName} ${gameNum} ${answers.length}/6`;
  const strings = answers.map((k) => {
    return k
      .split('')
      .map((w) => {
        return getStatusEmoji(w);
      })
      .join('');
  });
  return [today, ...strings].join('\n');
}

export function getStatusEmoji(status: string) {
  switch (status) {
    case 'x':
      return '🟩';
    case 'c':
      return '🟨';
    case '_':
    case 'i':
    default:
      return '⬛';
  }
}
