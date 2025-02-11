import { drizzle } from 'drizzle-orm/d1';
import { gameResults, users } from '../../drizzle/schema';
import { and, count, desc, eq, gt, lte, max, sql } from 'drizzle-orm';
import { getGameNum } from '../util/game-num';
import { Context } from 'hono';
import { ApiWordLettuceBindings } from '../util/env';

export function createGameResultsDao(c: Context<{ Bindings: ApiWordLettuceBindings }>) {
  const db = drizzle(c.env.wordlettuce_db);

  async function saveGame({ userId, gameNum, answers }: { userId: number; gameNum: number; answers: string }) {
    const attempts = Math.floor(answers.length / 5);
    return db
      .insert(gameResults)
      .values({
        gameNum,
        userId,
        answers,
        attempts,
      })
      .onConflictDoUpdate({
        target: [gameResults.userId, gameResults.gameNum],
        set: { answers, attempts },
      })
      .returning();
  }

  async function getRankings() {
    const gameNum = getGameNum();
    const query = db
      .select({
        user: users.username,
        games: count(gameResults.attempts),
        score: sql`count(${gameResults.attempts}) + sum(max(0, 6 - ${gameResults.attempts}))`
          .mapWith(Number)
          .as('score'),
      })
      .from(users)
      .innerJoin(gameResults, eq(users.id, gameResults.userId))
      .where(and(gt(gameResults.gameNum, gameNum - 7), lte(gameResults.gameNum, gameNum)))
      .groupBy(users.id)
      .orderBy(desc(sql`score`))
      .limit(10);
    return query.all();
  }

  async function getNextPageAfter({
    username,
    limit = 30,
    start = getGameNum(),
  }: {
    username: string;
    limit: number;
    start: number;
  }) {
    const query = db
      .select({
        gameNum: gameResults.gameNum,
        answers: gameResults.answers,
        userId: gameResults.userId,
        attempts: gameResults.attempts,
        score: sql`max(7 - attempts, 1)`.mapWith(gameResults.attempts),
      })
      .from(users)
      .innerJoin(gameResults, eq(users.id, gameResults.userId))
      .where(and(eq(users.username, username), lte(gameResults.gameNum, start)))
      .orderBy(desc(gameResults.gameNum))
      .limit(limit + 1);
    const results = await query.all();
    return {
      results: results.slice(0, limit),
      next: results.length > limit ? results.at(-1)?.gameNum : null,
      limit,
    };
  }

  async function upsertUser({ userId, username }: { userId: number; username: string }) {
    return db
      .insert(users)
      .values({ username, id: userId })
      .onConflictDoUpdate({ target: users.id, set: { username } })
      .returning();
  }

  return {
    saveGame,
    getRankings,
    upsertUser,
    getNextPageAfter,
  };
}
