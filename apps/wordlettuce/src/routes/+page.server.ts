import { getGameStateFromCookie } from '$lib/server/game';

export async function load() {
  const game = getGameStateFromCookie();
  return {
    game,
  };
}
