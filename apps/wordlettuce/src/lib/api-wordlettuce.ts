import ky, { HTTPError } from 'ky';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import type { GameResult } from './types';
import { error as svelteError } from '@sveltejs/kit';

interface ResponseLike {
  json(): Promise<unknown>;
  text(): Promise<string>;
  ok: Response['ok'];
}
type FetchLike = (...args: any[]) => Promise<ResponseLike>;

type CreateApiWordLettuceClientInput = {
  fetch?: FetchLike;
};

type GetGameResultsInput = { start: number; limit?: number } & (
  | { username: string; userID: never }
  | { userID: number; username: never }
);

export function createApiWordlettuceClient(input: CreateApiWordLettuceClientInput) {
  const api = ky.create({
    fetch: input.fetch as typeof fetch,
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
    const { data, error } = await api
      .get<{ rankings: Array<{ user: string; games: number; score: number }> }>('v2/rankings', {})
      .json()
      .then((data) => ({ data, error: undefined }))
      .catch((error) => ({ error, data: undefined }));
    if (error || !data) {
      throw svelteError(500, error);
    }
    return data.rankings;
  }

  return {
    getGameResults,
    getRankings,
  };
}
