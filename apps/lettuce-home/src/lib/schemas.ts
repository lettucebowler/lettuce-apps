import { parseDate, today } from '@internationalized/date';
import * as v from 'valibot';

export const ISODateString = v.pipe(v.string(), v.nonEmpty(), v.isoDate());

const Book = v.pipe(
  v.object({
    isbn: v.pipe(v.number(), v.toString(), v.isbn()),
    title: v.string(),
    subtitle: v.optional(v.string()),
    authors: v.array(v.string()),
    published: v.pipe(v.number(), v.integer()),
    reread: v.optional(v.boolean(), false),
  }),
  v.transform((book) => {
    return {
      ...book,
      url: `https://openlibrary.org/isbn/${book.isbn}`,
    };
  }),
);
export type Book = v.InferOutput<typeof Book>;

export const CurrentlyReadingList = v.object({
  books: v.array(Book),
});

export const ReadingLogEntry = v.intersect([
  Book,
  v.object({
    logDate: ISODateString,
    rating: v.optional(v.pipe(v.number(), v.integer())),
    comment: v.optional(v.string()),
  }),
]);
export type ReadingLogEntry = v.InferOutput<typeof ReadingLogEntry>;

export const ReadingLog = v.object({
  year: v.number(),
  books: v.array(ReadingLogEntry),
});
export type ReadingLog = v.InferOutput<typeof ReadingLog>;

export const Project = v.object({
  title: v.string(),
  status: v.picklist(['active', 'inactive', 'offline']),
  url: v.optional(v.pipe(v.string(), v.url())),
  description: v.optional(v.array(v.string())),
  summary: v.string(),
});
export type Project = v.InferOutput<typeof Project>;

export const ProjectLog = v.object({
  projects: v.array(Project),
});
export type ProjectLog = v.InferOutput<typeof ProjectLog>;

export const MovieLogEntry = v.pipe(
  v.object({
    tmdb: v.pipe(v.number(), v.integer()),
    title: v.string(),
    directors: v.array(v.string()),
    released: v.pipe(v.number(), v.integer()),
    logDate: ISODateString,
    rating: v.optional(v.pipe(v.number(), v.integer())),
    comment: v.optional(v.string()),
    rewatch: v.optional(v.boolean(), false),
  }),
  v.transform((movie) => {
    return {
      ...movie,
      url: `https://www.themoviedb.org/movie/${movie.tmdb}`,
    };
  }),
);
export type MovieLogEntry = v.InferOutput<typeof MovieLogEntry>;

export const Post = v.object({
  title: v.string(),
  summary: v.optional(v.string()),
  date: v.string(),
  tags: v.optional(v.array(v.string())),
  published: v.boolean(),
});
export type Post = v.InferOutput<typeof Post>;

export const MovieLog = v.object({
  year: v.number(),
  movies: v.array(MovieLogEntry),
});
export type MovieLog = v.InferOutput<typeof MovieLog>;

export type LogEntry = ReadingLogEntry | MovieLogEntry;

export const CalendarDateFromISODateString = v.fallback(
  v.pipe(
    v.optional(ISODateString, () => undefined),
    v.transform((value) => {
      if (!value) {
        return undefined;
      }
      return parseDate(value);
    }),
  ),
  undefined,
);

export const mediaLogFiltersFallbackStart = '1998-12-12';
export const mediaLogFiltersFallbackEnd = today('America/Chicago').toString();

export const DateRangeFromISODateStrings = v.object({
  start: CalendarDateFromISODateString,
  end: CalendarDateFromISODateString,
});
