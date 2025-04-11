import ky from 'ky';
import type { HTTPError } from 'ky';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import type { GameResult } from './types';
import { error as svelteError } from '@sveltejs/kit';

type CreateApiWordLettuceClientInput = {
  fetch: typeof fetch;
};

type GetGameResultsInput = { start: number; limit?: number } & (
  | { username: string; userID: never }
  | { userID: number; username: never }
);

export function createApiWordlettuceClient({ fetch }: CreateApiWordLettuceClientInput) {
  const api = ky.create({
    fetch: fetch,
    prefixUrl: PUBLIC_API_WORDLETTUCE_HOST,
  });

  async function getGameResults({ username, userID, limit = 30, start }: GetGameResultsInput) {
    const searchParams = new URLSearchParams({
      start: start.toString(),
      limit: limit.toString(),
    });
    if (userID) {
      searchParams.set('userID', userID.toString());
    } else {
      searchParams.set('username', username);
    }
    const { data, error } = await api
      .get<{
        limit: number;
        start: number;
        next: number;
        results: Array<GameResult>;
      }>('v1/game-results', {
        searchParams,
      })
      .json()
      .then((data) => ({ data, error: undefined }))
      .catch((error) => ({ error: error as HTTPError, data: undefined }));
    if (error) {
      if (error.response.status === 404) {
        throw svelteError(404, 'User not found');
      }
      throw svelteError(500, error.message ?? '');
    }
    return data;
  }

  async function getRankings() {
    return api.get<{ rankings: Array<{ user: string; games: number; score: number }> }>('v2/rankings', {}).json();
  }

  return {
    getGameResults,
    getRankings,
  };
}
