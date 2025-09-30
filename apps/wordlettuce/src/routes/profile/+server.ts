import { redirect } from '@sveltejs/kit';
import { getSession } from '../auth.remote';

export async function GET(event) {
  const session = await getSession();
  if (session.authenticated) {
    throw redirect(307, `/profile/${session.user.username}`);
  } else {
    throw redirect(307, '/signin?referrer=/profile');
  }
}
