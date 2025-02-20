import { redirect } from '@sveltejs/kit';
import { clearTokens, createAuthClient, setTokens } from '$lib/auth.server';
import { createApiWordlettuceClient } from '$lib/api-wordlettuce.server.js';
import { subjects } from '@lettuce-apps-packages/auth';

export async function GET(event) {
  const code = event.url.searchParams.get('code');
  const authClient = createAuthClient(event);
  const tokens = await authClient.exchange(code!, event.url.origin + '/callback');
  console.log('tokens', tokens);
  if (!tokens.err) {
    setTokens(event, tokens.tokens.access, tokens.tokens.refresh);
  } else {
    throw tokens.err;
  }
  try {
    const authClient = createAuthClient(event);
    const verified = await authClient.verify(subjects, event.cookies.get('access_token')!, {
      refresh: event.cookies.get('refresh_token') || undefined,
    });
    console.log('callback verified', verified);
    if (verified.err) {
      clearTokens(event);
      return redirect(302, `${event.url.origin}/`);
    }
    const game = event.locals.getGameStateV3();
    if (game.success) {
      const { saveGame } = createApiWordlettuceClient(event);
      await saveGame({
        userID: verified.subject.properties.userID,
        gameNum: game.gameNum,
        answers: game.answers.join(''),
      });
    }
  } catch (e) {
    console.error(e);
    // do nothing
  }
  return redirect(302, `${event.url.origin}/`);
}
