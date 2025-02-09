export const prerender = false;
import { createAuthClient } from '$lib/auth.server.js';
import type { NavLinkProps } from '$lib/types.js';
export async function load(event) {
  event.depends('data:gamenum');
  const links: NavLinkProps[] = [
    {
      path: '/',
      name: 'Home',
      enabled: true,
      prefetch: true,
    },
    {
      path: '/rankings',
      name: 'Rankings',
      enabled: true,
      prefetch: true,
    },
    {
      path: '/about',
      name: 'About',
      enabled: true,
      prefetch: true,
    },
  ];
  const gameNum = event.locals.getGameStateV3().gameNum;
  if (!event.locals.session) {
    const authClient = createAuthClient(event);
    const { url } = await authClient.authorize(`${event.url.origin}/callback`, 'code');
    return {
      authenticated: false as const,
      loginUrl: url,
      nav: links,
      gameNum,
    };
  }
  return {
    authenticated: true as const,
    nav: links,
    session: event.locals.session,
    gameNum,
  };
}

export const trailingSlash = 'never';
