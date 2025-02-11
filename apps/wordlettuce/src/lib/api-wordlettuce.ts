import { fetcher } from 'itty-fetcher';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import { error as svelteError } from '@sveltejs/kit';

type CreateApiWordLettuceClientInput = {
  fetch: typeof fetch;
};

export function createApiWordlettuceClient({ fetch }: CreateApiWordLettuceClientInput) {
  const api = fetcher({
    fetch: fetch,
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
      .get<{ rankings: Array<{ user: string; games: number; score: number }> }>('/v2/rankings')
      .then((data) => ({ data, error: undefined }))
      .catch((error) => ({ error, data: undefined }));
    if (error || !data) {
      console.log(error);
      throw svelteError(500, error);
    }
    return data.rankings;
  }

  return {
    getNextPageAfter,
    getRankings,
  };
}
