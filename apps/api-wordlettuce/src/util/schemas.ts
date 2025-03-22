import * as v from 'valibot';

export const PositiveInteger = v.pipe(v.number(), v.integer(), v.minValue(1));
export const UserID = PositiveInteger;
export const Username = v.string();
export const GameNumSchema = PositiveInteger;
export const AnswerSchema = v.pipe(
  v.string(),
  v.regex(/[xci_]/),
  v.check((input) => input.length % 5 === 0, 'Must be multiple of 5 characters'),
  v.transform((input) => input.slice(-30)),
);
