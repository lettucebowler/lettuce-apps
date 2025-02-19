import * as v from 'valibot';

export const Account = v.object({
  provider: v.string(),
  providerID: v.string(),
});

export type Account = v.InferOutput<typeof Account>;

export const UserSubject = v.object({
  userID: v.pipe(v.number(), v.integer()),
});

export type UserSubject = v.InferOutput<typeof UserSubject>;

export const User = v.object({
  id: v.pipe(v.number(), v.integer()),
  email: v.pipe(v.string(), v.email()),
  displayName: v.pipe(v.string()),
});

export type User = v.InferOutput<typeof User>;
