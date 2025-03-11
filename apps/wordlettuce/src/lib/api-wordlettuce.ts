import { fetcher, StatusError } from 'itty-fetcher';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import { error as svelteError } from '@sveltejs/kit';
import type { GameResult } from './types';

interface ResponseLike {
  json(): Promise<unknown>;
  text(): Promise<string>;
  ok: Response['ok'];
}
type FetchLike = (...args: any[]) => Promise<ResponseLike>;

type CreateApiWordLettuceClientInput = {
  fetch?: FetchLike;
};

export function createApiWordlettuceClient(input: CreateApiWordLettuceClientInput) {
  const api = fetcher({
    fetch: input.fetch as typeof fetch,
    base: PUBLIC_API_WORDLETTUCE_HOST,
  });

  async function getGameResults({
    username,
    userID,
    limit = 30,
    start,
  }: {
    username?: string;
    userID?: number;
    limit?: number;
    start: number;
  }) {
    const { data, error } = await api
      .get<{
        limit: number;
        start: number;
        next: number;
        results: Array<GameResult>;
      }>('/v1/game-results', userID ? { userID, start, limit } : { username: username!, start, limit })
      .then((data) => ({ data, error: undefined }))
      .catch((error) => ({ error: error as StatusError, data: undefined }));
    if (error) {
      if (error.status === 404) {
        throw svelteError(404, 'User not found');
      }
      throw svelteError(error.status);
    }
    return data;
  }

  async function getRankings() {
    const { data, error } = await api
      .get<{ rankings: Array<{ user: string; games: number; score: number }> }>('/v2/rankings', {})
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
