import * as v from 'valibot';
import { isAllowedGuess } from '$lib/words';

export const WordFormInput = v.object({
  word: v.pipe(
    v.string(),
    v.check((s) => isAllowedGuess({ guess: s }), `Invalid word`),
  ),
});
