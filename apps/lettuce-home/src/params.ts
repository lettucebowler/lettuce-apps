import { defineParams } from '@sveltejs/kit/params';
import { PostTag } from './lib/schemas.ts';
import * as v from 'valibot';

export const params = defineParams({
  year: v.pipe(v.string(), v.toNumber(), v.minValue(2026)),
  tag: PostTag,
});
