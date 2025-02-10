import * as v from 'valibot';

export const Account = v.object({
  provider: v.string(),
  providerId: v.string(),
});

export type Account = v.InferOutput<typeof Account>;

export const User = v.object({
  id: v.pipe(v.number(), v.integer()),
  email: v.pipe(v.string(), v.email()),
  displayName: v.pipe(v.string()),
  account: Account,
});

export type User = v.InferOutput<typeof User>;
