import { fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import { error as svelteError } from '@sveltejs/kit';

type CreateApiWordLettuceClientInput = {
  fetch: typeof fetch;
};

export function createApiWordlettuceServerClient({ fetch }: CreateApiWordLettuceClientInput) {
  const api = fetcher({
    fetch: fetch,
    base: PUBLIC_API_WORDLETTUCE_HOST,
    headers: {
      Authorization: `Bearer ${API_WORDLETTUCE_TOKEN}`,
    },
  });

  type SaveGameInput = {
    userID: number;
    gameNum: number;
    answers: string;
  }
  async function saveGame({ userID, gameNum, answers }: SaveGameInput) {
    const { data, error } = await api
      .post<SaveGameInput, {
        gameNum: number;
        userID: string;
        answers: string;
        attempts: number;
      }>('/v1/game-results', { userID, gameNum, answers })
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
