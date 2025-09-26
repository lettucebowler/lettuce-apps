import { redirect } from '@sveltejs/kit';
import type { PageParentData } from './$types.js';

export async function load(event) {
  const parentData: PageParentData = await event.parent();
  if (parentData.authenticated) {
    throw redirect(307, `/profile/${parentData.user.username}`);
  }
  return null;
}
