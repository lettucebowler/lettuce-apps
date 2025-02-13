import { fetcher } from 'itty-fetcher';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
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

export function createApiWordlettuceClient(input: CreateApiWordLettuceClientInput) {
  const api = fetcher({
    fetch: input.fetch as typeof fetch,
    base: PUBLIC_API_WORDLETTUCE_HOST,
  });

  async function getNextPageAfter({
    username,
    limit = 30,
    start,
  }: {
    username: string;
    limit?: number;
    start: number;
  }) {
    const { data, error } = await api
      .get<{
        limit: number;
        start: number;
        next: number;
        results: Array<{
          gameNum: number;
          attempts: number;
          answers: string;
          userId: number;
          score: number;
        }>;
      }>('/v1/game-results', { username, limit, start })
      .then((data) => ({ data, error: undefined }))
      .catch((error) => ({ error: error as Error, data: undefined }));
    if (error) {
      throw svelteError(500, error);
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
    getNextPageAfter,
    getRankings,
  };
}
