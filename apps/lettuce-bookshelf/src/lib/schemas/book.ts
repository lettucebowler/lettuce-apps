import * as v from 'valibot';

export const BookData = v.object({
	isbn: v.pipe(v.number(), v.transform(String)),
	log_date: v.string(),
	title: v.string(),
	subtitle: v.optional(v.string()),
	author_name: v.string(),
	cover_image: v.string(),
	first_publish_year: v.number(),
	link: v.optional(v.string())
});
export type BookData = v.InferOutput<typeof BookData>;

export const ReadingLogEntry = v.object({
	isbn: v.pipe(v.number(), v.transform(String)),
	log_date: v.string(),
	title_override: v.optional(v.string()),
	subtitle_override: v.optional(v.string()),
	author_name_override: v.optional(v.string()),
	cover_image_override: v.optional(v.string()),
	first_publish_year_override: v.optional(v.number()),
	link_override: v.optional(v.string())
});
export type ReadingLogEntry = v.InferOutput<typeof ReadingLogEntry>;

export const ReadingLog = v.object({
	books: v.array(ReadingLogEntry)
});
