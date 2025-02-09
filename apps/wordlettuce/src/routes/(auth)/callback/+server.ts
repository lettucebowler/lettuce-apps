import { redirect } from '@sveltejs/kit';
import { createAuthClient, setTokens } from '$lib/auth.server';
import { createApiWordlettuceClient } from '$lib/api-wordlettuce.server.js';
import { subjects } from '@lettuce-apps-packages/auth';

export async function GET(event) {
  const code = event.url.searchParams.get('code');
  const authClient = createAuthClient(event);
  const tokens = await authClient.exchange(code!, event.url.origin + '/callback');
  if (!tokens.err) {
    setTokens(event, tokens.tokens.access, tokens.tokens.refresh);
  } else {
    throw tokens.err;
  }
  try {
    const game = event.locals.getGameStateV3();
    if (game.success) {
      const authClient = createAuthClient(event);
      const verified = await authClient.verify(subjects, event.cookies.get('access_token')!, {
        refresh: event.cookies.get('refresh_token') || undefined,
      });
      if (!verified.err) {
        const apiWordlettuce = createApiWordlettuceClient(event);
        await apiWordlettuce.saveGame({
          userId: Number(verified.subject.properties.account.providerId),
          gameNum: game.gameNum,
          answers: game.answers.join(''),
        });
      }
    }
  } catch (e) {
    console.error(e);
    // do nothing
  }
  return redirect(302, `${event.url.origin}/`);
}
