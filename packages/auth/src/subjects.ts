import { createSubjects } from '@openauthjs/openauth/subject';
import { User } from './schemas';

export const subjects = createSubjects({
  user: User,
});
