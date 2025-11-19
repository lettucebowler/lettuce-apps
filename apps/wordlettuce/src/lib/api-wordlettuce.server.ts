import { API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import { error as svelteError } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import ky, { HTTPError } from 'ky';
import * as v from 'valibot';
import type { GameResult } from './types';

function createAPIWordlettuceClient() {
  const event = getRequestEvent();
  return ky.create({
    prefixUrl: PUBLIC_API_WORDLETTUCE_HOST,
    fetch: event.fetch,
    headers: {
      Authorization: `Bearer ${API_WORDLETTUCE_TOKEN}`,
    },
  });
}

export async function saveGame({
  userID,
  gameNum,
  answers,
}: SaveGameInput): Promise<[SaveGameOutput, null] | [null, { message: string }]> {
  try {
    const client = createAPIWordlettuceClient();
    const saveGameResponse = await client
      .post<SaveGameOutput>('v1/game-results', { json: { userID, gameNum, answers } })
      .json();
    return [saveGameResponse, null];
  } catch (error) {
    if (error instanceof HTTPError) {
      const json = await error.response.json();
      return [null, { message: json.message }];
    }
    if (error instanceof Error) {
      return [null, { message: error.message }];
    }
    return [null, { message: 'Unexpected error' }];
  }
}

export async function getRankings(_: GetRankingsInput): Promise<GetRankingsOutput> {
  const client = createAPIWordlettuceClient();
  const rankingsResponse = await client.get<{ rankings: GetRankingsOutput }>('v2/rankings').json();
  return rankingsResponse.rankings;
}

export async function getGameResults({
  username,
  userID,
  limit = 30,
  start,
}: GetGameResultsInput): Promise<GetGameResultsOutput> {
  const client = createAPIWordlettuceClient();
  return client
    .get<GetGameResultsOutput>('v1/game-results', {
      searchParams: userID ? { userID, start, limit } : { username: username!, start, limit },
    })
    .json();
}

export type GetRankingsInput = void;
export type GetRankingsOutput = Array<{ user: string; games: number; score: number }>;

export type SaveGameInput = {
  userID: number;
  gameNum: number;
  answers: string;
};
export type SaveGameOutput = {
  gameNum: number;
  userID: number;
  answers: string;
  attempts: number;
};

export type GetGameResultsOutput = {
  limit: number;
  start: number;
  next: number;
  results: Array<GameResult>;
};
export const GetGameResultsInput = v.object({
  username: v.optional(v.string()),
  userID: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
  limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  start: v.pipe(v.number(), v.integer(), v.minValue(0)),
});
export type GetGameResultsInput = v.InferOutput<typeof GetGameResultsInput>;
