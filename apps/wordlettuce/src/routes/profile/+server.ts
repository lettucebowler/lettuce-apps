import { redirect } from '@sveltejs/kit';
import { sessionQuery } from '../auth.remote';

export async function GET(event) {
  const session = await sessionQuery();
  if (session.authenticated) {
    throw redirect(307, `/profile/${session.user.username}`);
  } else {
    throw redirect(307, '/signin?referrer=/profile');
  }
}
