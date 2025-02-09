import { createSubjects } from '@openauthjs/openauth/subject';
import * as v from 'valibot';

export const subjects = createSubjects({
  user: v.object({
    id: v.pipe(v.string(), v.uuid()),
    email: v.pipe(v.string(), v.email()),
    display_name: v.pipe(v.string()),
    account: v.object({
      provider: v.picklist(['github']),
      providerId: v.string(),
    }),
  }),
});
