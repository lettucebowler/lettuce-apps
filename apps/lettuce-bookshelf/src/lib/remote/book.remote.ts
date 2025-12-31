import * as v from 'valibot';
import { prerender, query } from '$app/server';
import { getBooksByISBN } from '$lib/clients/openlibrary';
import books from '$lib/assets/books.yaml';
import { ReadingLog } from '$lib/schemas/book';

export const getBook = query.batch(v.string(), async (isbns) => {
	const books = await getBooksByISBN({ isbns });
	const data = books.docs
		.map((work) => {
			const [edition] = work.editions.docs;
			console.log(edition);
			if (!edition) {
				return edition;
			}
			const [author_name] = work.author_name ?? [];
			const [isbn] = edition.isbn;
			return {
				isbn,
				title: edition.title,
				cover_image: `https://covers.openlibrary.org/b/id/${edition.cover_i}-L.jpg`,
				author_name,
				first_publish_year: work.first_publish_year,
				subtitle: edition.subtitle ?? null
			};
		})
		.filter(Boolean);
	const lookup = new Map(data.map((item) => [item.isbn, item]));
	return (isbn) => lookup.get(isbn);
});

const readingLog = v.parse(ReadingLog, books);
export const getBooks = prerender(async () => {
	const booksResult = await getBooksByISBN({
		isbns: readingLog.books.map((logEntry) => logEntry.isbn)
	});
	const bookData = new Map(
		booksResult.docs
			.map((work) => {
				const [edition] = work.editions.docs;
				if (!edition) {
					return edition;
				}
				const [author_name] = work.author_name ?? [];
				const [isbn] = edition.isbn;
				return {
					isbn,
					title: edition.title,
					cover_image: `https://covers.openlibrary.org/b/id/${edition.cover_i}-L.jpg`,
					author_name,
					first_publish_year: work.first_publish_year,
					subtitle: edition.subtitle ?? null,
					link: `https://openlibrary.org${edition.key}`
				};
			})
			.filter(Boolean)
			.map((book) => [book.isbn, book])
	);
	return readingLog.books.map((book) => {
		const fetchedData = bookData.get(book.isbn);
		if (!fetchedData) {
			return {
				isbn: book.isbn,
				log_date: book.log_date,
				title: book.title_override,
				subtitle: book.subtitle_override ?? null,
				author_name: book.author_name_override,
				first_publish_year: book.first_publish_year_override,
				cover_image: book.cover_image_override,
				link: book.link_override ?? null
			};
		}
		return {
			isbn: book.isbn,
			log_date: book.log_date,
			title: book.title_override ?? fetchedData.title,
			subtitle: book.subtitle_override ?? fetchedData.subtitle,
			author_name: book.author_name_override ?? fetchedData.author_name,
			first_publish_year: book.first_publish_year_override ?? fetchedData.first_publish_year,
			cover_image: book.cover_image_override ?? fetchedData.cover_image,
			link: book.link_override ?? fetchedData.link
		};
	});
});
