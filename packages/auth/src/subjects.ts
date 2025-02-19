import { createSubjects } from '@openauthjs/openauth/subject';
import { UserSubject } from './schemas';

export const subjects = createSubjects({
  user: UserSubject,
});
