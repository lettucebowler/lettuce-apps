import type { KVNamespace } from '@cloudflare/workers-types';
import { createLocalJWKSet, errors, JSONWebKeySet, jwtVerify } from 'jose';
import type { StandardSchemaV1 as v1 } from '@standard-schema/spec';

import {
  ClientInput,
  WellKnown,
  createClient,
  VerifyOptions,
  VerifyResult,
  VerifyError,
} from '@openauthjs/openauth/client';
import { SubjectSchema } from '@openauthjs/openauth/subject';
import { InvalidAccessTokenError, InvalidSubjectError } from '@openauthjs/openauth/error';
// import { fetcher } from 'itty-fetcher';
import { User } from './schemas';

interface ResponseLike {
  json(): Promise<unknown>;
  text(): Promise<string>;
  ok: Response['ok'];
}
type FetchLike = (...args: any[]) => Promise<ResponseLike>;

type AuthClientInput = Omit<ClientInput, 'fetch'> & {
  storage?: KVNamespace;
  issuer: string;
  keyset?: JSONWebKeySet;
  fetch: FetchLike;
};
export function createAuthClient(input: AuthClientInput) {
  const f = input.fetch ?? fetch;

  function getIssuerKey(issuer: string) {
    const key = `oauth:issuer:${issuer}`;
    return key;
  }

  async function getIssuer(): Promise<WellKnown> {
    if (input.storage) {
      const cached = await input.storage.get(getIssuerKey(input.issuer), {
        type: 'json',
        cacheTtl: 3600,
      });
      if (cached) {
        return cached as WellKnown;
      }
    }
    const wellKnown = (await (f || fetch)(`${input.issuer}/.well-known/oauth-authorization-server`).then((r) =>
      r.json(),
    )) as WellKnown;
    if (input.storage) {
      input.storage.put(getIssuerKey(input.issuer), JSON.stringify(wellKnown));
    }
    return wellKnown;
  }

  function getJWKSKey(issuer: string) {
    return `oauth:jwks:${issuer}`;
  }

  async function getJWKS() {
    if (input.keyset) {
      return createLocalJWKSet(input.keyset);
    }
    let keyset: JSONWebKeySet | undefined = undefined;
    if (input.storage) {
      const cachedKeyset = await input.storage
        .get(getJWKSKey(input.issuer), { type: 'json', cacheTtl: 3600 })
        .then((r) => r as JSONWebKeySet);
      if (cachedKeyset) {
        keyset = cachedKeyset;
        return createLocalJWKSet(keyset);
      }
    }
    if (!keyset) {
      const wk = await getIssuer();
      keyset = (await (f || fetch)(wk.jwks_uri).then((r) => r.json())) as JSONWebKeySet;
    }
    if (input.storage) {
      input.storage.put(getJWKSKey(input.issuer), JSON.stringify(keyset));
    }
    return createLocalJWKSet(keyset);
  }

  // const api = fetcher({
  //   base: input.issuer,
  //   fetch: f,
  // });

  async function getUser({ userID }: { userID: number }): Promise<User> {
    const test = await f(`${input.issuer}/users/${userID}`).then((r) => r.text());
    console.log(test);
    return JSON.parse(test) as User;
  }

  const result = {
    ...createClient(input),
    async verify<T extends SubjectSchema>(
      subjects: T,
      token: string,
      options: VerifyOptions,
    ): Promise<VerifyResult<T> | VerifyError> {
      const jwks = await getJWKS();
      const issuer = input.issuer;
      try {
        const result = await jwtVerify<{
          mode: 'access';
          type: keyof T;
          properties: v1.InferInput<T[keyof T]>;
        }>(token, jwks, {
          issuer,
        });
        const validated = await subjects[result.payload.type]['~standard'].validate(result.payload.properties);
        if (!validated.issues && result.payload.mode === 'access')
          return {
            aud: result.payload.aud as string,
            subject: {
              type: result.payload.type,
              properties: validated.value,
            } as any,
          };
        return {
          err: new InvalidSubjectError(),
        };
      } catch (e) {
        if (e instanceof errors.JWTExpired && options?.refresh) {
          const refreshed = await this.refresh(options.refresh);
          if (refreshed.err) return refreshed;
          const verified = await result.verify(subjects, refreshed.tokens!.access, {
            refresh: refreshed.tokens!.refresh,
            issuer,
            fetch: options?.fetch,
          });
          if (verified.err) return verified;
          verified.tokens = refreshed.tokens;
          return verified;
        }
        return {
          err: new InvalidAccessTokenError(),
        };
      }
    },
    getUser,
  };
  return result;
}
