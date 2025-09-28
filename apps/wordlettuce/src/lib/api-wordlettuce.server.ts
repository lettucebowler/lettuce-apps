import { fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import { error as svelteError } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import ky from 'ky';

function createClient() {
  const event = getRequestEvent();
  return fetcher({
    fetch: event.fetch,
    base: PUBLIC_API_WORDLETTUCE_HOST,
    headers: {
      Authorization: `Bearer ${API_WORDLETTUCE_TOKEN}`,
    },
  });
}

function createKYClient() {
  const event = getRequestEvent();
  return ky.create({
    prefixUrl: PUBLIC_API_WORDLETTUCE_HOST,
    fetch: event.fetch,
  });
}

type SaveGameInput = {
  userID: number;
  gameNum: number;
  answers: string;
};
export async function saveGame({ userID, gameNum, answers }: SaveGameInput) {
  const api = createClient();
  const { data, error } = await api
    .post<
      SaveGameInput,
      {
        gameNum: number;
        userID: string;
        answers: string;
        attempts: number;
      }
    >('/v1/game-results', { userID, gameNum, answers })
    .then((data) => ({ data, error: undefined }))
    .catch((error) => ({ error, data: undefined }));
  if (error) {
    throw svelteError(500, error);
  }
  return data ? [data] : [];
}

export async function getRankings() {
  const client = createKYClient();
  const rankingsResponse = await client.get<{ rankings: Array<{ user: string; games: number; score: number }> }>(
    'v2/rankings',
  );
  const rankingsJson = await rankingsResponse.json();
  return rankingsJson.rankings;
}
