import { fetcher } from 'itty-fetcher';
import ky from 'ky';
import { API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import { error as svelteError } from '@sveltejs/kit';

type CreateApiWordLettuceClientInput = {
  fetch: typeof fetch;
};

export function createApiWordlettuceServerClient({ fetch }: CreateApiWordLettuceClientInput) {
  const api = ky.create({
    fetch: fetch,
    prefixUrl: PUBLIC_API_WORDLETTUCE_HOST,
    headers: {
      Authorization: `Bearer ${API_WORDLETTUCE_TOKEN}`,
    },
  });

  async function saveGame({ userID, gameNum, answers }: { userID: number; gameNum: number; answers: string }) {
    const { data, error } = await api
      .post<{
        gameNum: number;
        userID: string;
        answers: string;
        attempts: number;
      }>('v1/game-results', { json: { userID, gameNum, answers } })
      .json()
      .then((data) => ({ data, error: undefined }))
      .catch((error) => ({ error, data: undefined }));
    if (error) {
      throw svelteError(500, error);
    }
    return data ? [data] : [];
  }

  return {
    saveGame,
  };
}
