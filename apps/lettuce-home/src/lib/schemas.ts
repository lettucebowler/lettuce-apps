import * as v from 'valibot';

export const Month = v.picklist([
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]);
export type Month = v.InferOutput<typeof Month>;

export const ReadingLogEntry = v.object({
  isbn: v.pipe(v.number(), v.integer()),
  title: v.string(),
  subtitle: v.optional(v.string()),
  authors: v.array(v.string()),
  published: v.pipe(v.number(), v.integer()),
  completed: v.optional(v.string()),
  rating: v.optional(v.pipe(v.number(), v.integer())),
  comment: v.optional(v.string())
});
export type ReadingLogEntry = v.InferOutput<typeof ReadingLogEntry>;

export const ReadingLog = v.array(ReadingLogEntry);
export type ReadingLog = v.InferOutput<typeof ReadingLog>;

export const Project = v.object({
  title: v.string(),
  status: v.picklist(['active', 'inactive', 'offline']),
  url: v.optional(v.pipe(v.string(), v.url())),
  description: v.optional(v.array(v.string())),
  summary: v.string()
});
export type Project = v.InferOutput<typeof Project>;

export const ProjectLog = v.object({
  projects: v.array(Project)
});
export type ProjectLog = v.InferOutput<typeof ProjectLog>;

export const MovieLogEntry = v.object({
  tmdb: v.pipe(v.number(), v.integer()),
  title: v.string(),
  directors: v.array(v.string()),
  released: v.pipe(v.number(), v.integer()),
  watched: v.string(),
  rating: v.optional(v.pipe(v.number(), v.integer())),
  comment: v.optional(v.string()),
  rewatch: v.optional(v.boolean(), false)
});
export type MovieLogEntry = v.InferOutput<typeof MovieLogEntry>;

export const MovieLog = v.array(MovieLogEntry);
export type MovieLog = v.InferOutput<typeof MovieLog>;
