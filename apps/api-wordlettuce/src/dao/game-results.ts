import { drizzle } from 'drizzle-orm/d1';
import { gameResults, users } from '../../drizzle/schema';
import { and, count, desc, eq, gt, lte, sql } from 'drizzle-orm';
import { getGameNum } from '../util/game-num';
import { Context } from 'hono';
import { ApiWordlettuceHono } from '../util/env';

export function createGameResultsDao(c: Context<ApiWordlettuceHono>) {
  const db = drizzle(c.env.wordlettuce_db.withSession() as unknown as D1Database);

  async function saveGame({ userID, gameNum, answers }: { userID: number; gameNum: number; answers: string }) {
    const attempts = Math.floor(answers.length / 5);
    return db
      .insert(gameResults)
      .values({
        gameNum,
        userID,
        answers,
        attempts,
      })
      .onConflictDoUpdate({
        target: [gameResults.userID, gameResults.gameNum],
        set: { answers, attempts },
      })
      .returning();
  }

  async function getRankings() {
    const gameNum = getGameNum();
    const query = db
      .select({
        userID: gameResults.userID,
        games: count(gameResults.attempts),
        score: sql`count(${gameResults.attempts}) + sum(max(0, 6 - ${gameResults.attempts}))`
          .mapWith(Number)
          .as('score'),
      })
      .from(gameResults)
      .where(and(gt(gameResults.gameNum, gameNum - 7), lte(gameResults.gameNum, gameNum)))
      .groupBy(gameResults.userID)
      .orderBy(desc(sql`score`))
      .limit(10);
    return query.all();
  }

  async function getUserGameResults({
    userID,
    limit = 30,
    start = getGameNum(),
  }: {
    userID: number;
    limit: number;
    start: number;
  }) {
    return db
      .select({
        gameNum: gameResults.gameNum,
        answers: gameResults.answers,
        userID: gameResults.userID,
        attempts: gameResults.attempts,
        score: sql`max(7 - attempts, 1)`.mapWith(gameResults.attempts),
      })
      .from(gameResults)
      .where(and(eq(gameResults.userID, userID), lte(gameResults.gameNum, start)))
      .orderBy(desc(gameResults.gameNum))
      .limit(limit + 1)
      .then((r) => {
        return {
          results: r.slice(0, limit),
          next: r.length > limit ? r.at(-1)?.gameNum : null,
          limit,
        };
      });
  }

  async function upsertUser({ userID, username }: { userID: number; username: string }) {
    return db
      .insert(users)
      .values({ username, id: userID })
      .onConflictDoUpdate({ target: users.id, set: { username } })
      .returning();
  }

  return {
    saveGame,
    getRankings,
    upsertUser,
    getUserGameResults,
  };
}
