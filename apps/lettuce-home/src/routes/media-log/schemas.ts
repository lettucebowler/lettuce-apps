import * as v from 'valibot';
import { today } from '@internationalized/date';

export const mediaLogFiltersFallbackStart = '1998-12-12';
export const mediaLogFiltersFallbackEnd = today('America/Chicago').toString();

export const ISODateString = v.pipe(v.string(), v.nonEmpty(), v.isoDate());
export const MediaLogFilters = v.object({
  start: v.fallback(v.optional(ISODateString, mediaLogFiltersFallbackStart), mediaLogFiltersFallbackStart),
  end: v.fallback(v.optional(ISODateString, mediaLogFiltersFallbackEnd), mediaLogFiltersFallbackEnd)
});
