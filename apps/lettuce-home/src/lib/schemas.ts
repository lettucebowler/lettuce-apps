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

export const ReadingLogEntry = v.pipe(
  v.object({
    isbn: v.pipe(v.number(), v.integer()),
    title: v.string(),
    subtitle: v.optional(v.string()),
    authors: v.array(v.string()),
    published: v.pipe(v.number(), v.integer()),
    completed: v.optional(v.string()),
    rating: v.optional(v.pipe(v.number(), v.integer())),
    comment: v.optional(v.string())
  }),
  v.transform((input) => ({ ...input, type: 'book' as 'book' }))
);
export type ReadingLogEntry = v.InferOutput<typeof ReadingLogEntry>;

export const ReadingLog = v.object({
  year: v.union([v.number(), v.literal('current')]),
  books: v.array(ReadingLogEntry)
});
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

export const MovieLogEntry = v.pipe(
  v.object({
    tmdb: v.pipe(v.number(), v.integer()),
    title: v.string(),
    directors: v.array(v.string()),
    released: v.pipe(v.number(), v.integer()),
    watched: v.string(),
    rating: v.optional(v.pipe(v.number(), v.integer())),
    comment: v.optional(v.string()),
    rewatch: v.optional(v.boolean(), false)
  }),
  v.transform((input) => ({ ...input, type: 'movie' as 'movie' }))
);
export type MovieLogEntry = v.InferOutput<typeof MovieLogEntry>;

export const Post = v.object({
  title: v.string(),
  summary: v.optional(v.string()),
  date: v.string(),
  tags: v.optional(v.array(v.string())),
  published: v.boolean()
});
export type Post = v.InferOutput<typeof Post>;

export const MovieLog = v.object({
  year: v.number(),
  movies: v.array(MovieLogEntry)
});
export type MovieLog = v.InferOutput<typeof MovieLog>;
