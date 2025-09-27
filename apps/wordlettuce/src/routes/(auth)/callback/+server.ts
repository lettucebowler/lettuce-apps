import { redirect } from '@sveltejs/kit';
import { clearTokens, createAuthClient, setTokens } from '$lib/auth.server';
import * as apiWordLettuce from '$lib/api-wordlettuce.server';
import { subjects } from '@lettuce-apps-packages/auth';
import { getGameStateFromCookie } from '$lib/game.server';

export async function GET(event) {
  const code = event.url.searchParams.get('code');
  const authClient = createAuthClient();
  const tokens = await authClient.exchange(code!, event.url.origin + '/callback');
  if (!tokens.err) {
    setTokens(event, tokens.tokens.access, tokens.tokens.refresh);
  } else {
    throw tokens.err;
  }
  try {
    const verified = await authClient.verify(subjects, event.cookies.get('access_token')!, {
      refresh: event.cookies.get('refresh_token') || undefined,
    });
    if (verified.err) {
      clearTokens();
      return redirect(302, `${event.url.origin}/`);
    }
    const game = getGameStateFromCookie();
    if (game.success) {
      await apiWordLettuce.saveGame({
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
