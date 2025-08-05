import * as v from 'valibot';
import { getRequestEvent, query } from '$app/server';
import { createApiWordlettuceClient } from '$lib/api-wordlettuce';

const NonNegativeIntegerWithFallback = (fallback: number) =>
  v.fallback(v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), fallback), fallback);

export const getGameResults = query(
  v.object({
    username: v.optional(v.string()),
    userID: v.optional(v.number()),
    limit: NonNegativeIntegerWithFallback(30),
    start: NonNegativeIntegerWithFallback(0),
  }),
  async (input) => {
    console.log('remote function woohoo');
    const event = getRequestEvent();
    const apiWordLettuce = createApiWordlettuceClient({ fetch: event.fetch });
    return apiWordLettuce.getGameResults(input);
  },
);
