import type { Context } from 'hono';
import type { MiddlewareHandler } from 'hono';

export const cache = (options: {
  cacheName: string | ((c: Context) => Promise<string> | string);
  cacheControl?: string;
  vary?: string | string[];
  keyGenerator?: (c: Context) => Promise<string> | string;
  shouldICacheThisResponse: (res: Response) => Promise<boolean>;
}): MiddlewareHandler => {
  // @ts-expect-error idk just don't want to deal with it
  if (!globalThis.caches) {
    console.log('Cache Middleware is not enabled because caches is not defined.');
    return async (_c, next) => await next();
  }

  const cacheControlDirectives = options.cacheControl?.split(',').map((directive) => directive.toLowerCase());
  const varyDirectives = Array.isArray(options.vary)
    ? options.vary
    : options.vary?.split(',').map((directive) => directive.trim());
  if (options.vary?.includes('*')) {
    throw new Error('Middleware vary configuration cannot include "*", as it disallows effective caching.');
  }

  const addHeader = (c: Context) => {
    if (cacheControlDirectives) {
      const existingDirectives =
        c.res.headers
          .get('Cache-Control')
          ?.split(',')
          .map((d) => d.trim().split('=', 1)[0]) ?? [];
      for (const directive of cacheControlDirectives) {
        let [name, value] = directive.trim().split('=', 2);
        name = name.toLowerCase();
        if (!existingDirectives.includes(name)) {
          c.header('Cache-Control', `${name}${value ? `=${value}` : ''}`, { append: true });
        }
      }
    }

    if (varyDirectives) {
      const existingDirectives =
        c.res.headers
          .get('Vary')
          ?.split(',')
          .map((d) => d.trim()) ?? [];

      const vary = Array.from(
        new Set([...existingDirectives, ...varyDirectives].map((directive) => directive.toLowerCase())),
      ).sort();

      if (vary.includes('*')) {
        c.header('Vary', '*');
      } else {
        c.header('Vary', vary.join(', '));
      }
    }
  };

  return async function cache(c, next) {
    let key = c.req.url;
    if (options.keyGenerator) {
      key = await options.keyGenerator(c);
    }

    const cacheName = typeof options.cacheName === 'function' ? await options.cacheName(c) : options.cacheName;
    const cache = await caches.open(cacheName);
    const response = await cache.match(key);
    if (response) {
      return new Response(response.body, response);
    }

    await next();
    if (!c.res.ok) {
      return;
    }
    addHeader(c);
    const res = c.res.clone();
    if (options.shouldICacheThisResponse) {
      const res = c.res.clone();
      const should = await options.shouldICacheThisResponse(res);
      if (!should) {
        return;
      }
    }
    c.executionCtx.waitUntil(cache.put(key, res));
  };
};
