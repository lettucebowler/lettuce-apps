import { createSubjects } from "@openauthjs/openauth/subject";
import * as v from "valibot";

export const subjects = createSubjects({
  user: v.object({
    provider: v.picklist(["github"]),
    providerId: v.string(),
    username: v.string(),
  }),
});
