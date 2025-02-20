import * as v from 'valibot';

export const Account = v.object({
  provider: v.string(),
  providerID: v.string(),
});

export type Account = v.InferOutput<typeof Account>;

export const User = v.object({
  id: v.pipe(v.number(), v.integer()),
  email: v.pipe(v.string(), v.email()),
  username: v.pipe(v.string()),
});

export type User = v.InferOutput<typeof User>;

export const UserSubject = v.object({
  userID: v.pipe(v.number(), v.integer()),
  ...v.pick(User, ['username']).entries,
});

export type UserSubject = v.InferOutput<typeof UserSubject>;
