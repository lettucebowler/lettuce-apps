import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import ky from 'ky';
import * as v from 'valibot';
import type { GameResult } from './types';

function createAPIWordlettuceClient() {
  return ky.create({
    prefixUrl: PUBLIC_API_WORDLETTUCE_HOST,
  });
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
