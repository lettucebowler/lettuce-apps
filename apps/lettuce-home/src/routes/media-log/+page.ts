import { DateRangeFromISODateStrings } from '$lib/schemas.js';
import * as v from 'valibot';

export const prerender = false;

export async function load(event) {
  const url = event.url;
  const searchObject = Object.fromEntries(url.searchParams.entries());
  return v.parse(DateRangeFromISODateStrings, searchObject);
}
