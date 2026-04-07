import { query } from '$app/server';
import { getSession } from '$lib/server/auth';

export const sessionQuery = query(async () => getSession());
