import { getGameStateFromCookie, saveGameStateToCookie } from '$lib/game.server';

export const trailingSlash = 'never';

export async function load() {
  const game = getGameStateFromCookie();
  saveGameStateToCookie(game);
  return {
    game,
  };
}

// export const ssr = false;
