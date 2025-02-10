import * as v from 'valibot';

export const Account = v.object({
  provider: v.string(),
  providerId: v.string(),
});

export type Account = v.InferOutput<typeof Account>;

export const User = v.object({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  display_name: v.pipe(v.string()),
  account: Account,
});

export type User = v.InferOutput<typeof User>;
