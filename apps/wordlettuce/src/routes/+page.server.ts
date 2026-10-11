import { getGameStateFromCookie } from '#lib/server/game.js';

export async function load() {
  const game = getGameStateFromCookie();
  return {
    game,
  };
}
