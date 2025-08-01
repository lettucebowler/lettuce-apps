export const prerender = false;
export async function load(event) {
  if (!event.locals.session) {
    return {
      authenticated: false as const,
    };
  }
  const user = event.locals.session;
  return {
    authenticated: true as const,
    user,
  };
}

export const trailingSlash = 'never';
