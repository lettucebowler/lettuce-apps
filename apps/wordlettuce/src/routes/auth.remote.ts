import { query } from '$app/server';
import { getSession } from '#lib/server/auth.js';

export const sessionQuery = query(async () => getSession());
