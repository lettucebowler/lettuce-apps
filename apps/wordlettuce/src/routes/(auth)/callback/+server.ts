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
    console.log('happy tokens');
    setTokens(event, tokens.tokens.access, tokens.tokens.refresh);
  } else {
    console.log('tokens err', tokens);
    throw tokens.err;
  }
  try {
    const verified = await authClient.verify(subjects, tokens.tokens.access, {
      refresh: tokens.tokens.refresh || undefined,
    });
    if (verified.err) {
      console.log('verified', verified);
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
  const referrer = event.cookies.get('signin-referrer');
  event.cookies.delete('signin-referrer', { path: '/' });
  return redirect(302, `${event.url.origin}${referrer ?? ''}`);
}
