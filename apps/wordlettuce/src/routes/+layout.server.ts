export const prerender = false;
import { createAuthClient } from '$lib/auth.server.js';
import type { NavLinkProps } from '$lib/types.js';
export async function load(event) {
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
  if (!event.locals.session) {
    const authClient = createAuthClient(event);
    const { url } = await authClient.authorize(`${event.url.origin}/callback`, 'code');
    return {
      authenticated: false as const,
      loginUrl: url,
      nav: links,
    };
  }
  const authClient = createAuthClient(event);
  const user = await authClient.getUser({ userID: event.locals.session.userID });
  return {
    authenticated: true as const,
    nav: links,
    user,
  };
}

export const trailingSlash = 'never';
