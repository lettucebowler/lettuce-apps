import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';
import { type RequestEvent } from '@sveltejs/kit';
import type { GameResult } from './types';
import ky from 'ky';

export function createApiWordlettuceClient(event: RequestEvent) {
  const client = ky.create({
    prefixUrl: PUBLIC_API_WORDLETTUCE_HOST,
    fetch: event.fetch,
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
    const gameResultsResponse = await client.get<{
      limit: number;
      start: number;
      next: number;
      results: Array<GameResult>;
    }>('v1/game-results', { searchParams: userID ? { userID, start, limit } : { username: username!, start, limit } });
    return await gameResultsResponse.json();
  }

  async function getRankings() {
    const rankingsResponse = await client.get<{ rankings: Array<{ user: string; games: number; score: number }> }>(
      'v2/rankings',
    );
    const rankingsJson = await rankingsResponse.json();
    return rankingsJson.rankings;
  }

  return {
    getGameResults,
    getRankings,
  };
}
