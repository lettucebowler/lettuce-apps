import { createSubjects } from '@kagii/openauth/subject';
import { UserSubject } from './schemas';

export const subjects = createSubjects({
  user: UserSubject,
});
