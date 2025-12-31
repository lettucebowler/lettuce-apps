import ky from 'ky';

function createFetcher() {
	return ky.create({
		prefixUrl: 'https://openlibrary.org'
	});
}

export async function GetAlreadyRead({ user }: { user: string }) {
	const api = createFetcher();
	return api.get(`people/${user}/books/already-read.json`).json();
}

export async function getBookInfo({ olids }: { olids: string[] }) {
	const api = createFetcher();
	return api
		.get(
			`api/books?bibkeys=${olids.map((olid) => `OLID:${olid}`).join(',')}&format=json&jscmd=data&fields=url`
		)
		.json();
}

export async function getBooksByISBN({ isbns }: { isbns: string[] }): Promise<ISBNSearchResult> {
	const api = createFetcher();
	return api
		.get('search.json', {
			searchParams: {
				q: `${isbns.map((isbn) => `isbn:${isbn}`).join(' OR ')}`,
				fields:
					'key,author_name,editions,first_publish_year,editions.isbn,editions.title,editions.cover_i,editions.key,editions.subtitle'
			}
		})
		.json();
}

export type EditionDoc = {
	title: string;
	cover_i: number;
	isbn: string[];
	key: string;
	subtitle?: string;
};

export type WorkDoc = {
	author_name: string[];
	first_publish_year: number;
	key: string;
	editions: {
		docs: EditionDoc[];
	};
};

export type ISBNSearchResult = {
	numFound: number;
	start: number;
	docs: WorkDoc[];
};

export type Work = {
	title: string;
	key: string;
	cover_id: string;
	cover_edition_id: string;
	first_publish_year: string | null;
	logged_edition: string;
	logged_date: string;
};
