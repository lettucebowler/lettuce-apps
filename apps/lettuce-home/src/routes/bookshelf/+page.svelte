<script lang="ts">
	import * as v from 'valibot';
	import Book from './Book.svelte';

	import readingLog from './reading-log.yaml';

	const ReadingLog = v.record(
		v.pipe(v.string(), v.digits()),
		v.array(
			v.object({
				isbn: v.pipe(v.number(), v.integer()),
				title: v.string(),
				subtitle: v.optional(v.string()),
				author: v.string()
			})
		)
	);

	const bookData = v.parse(ReadingLog, readingLog);
</script>

<main class="container mx-auto flex flex-col">
	<h1 class="mb-4 text-3xl font-bold first-letter:capitalize">bookshelf</h1>
	<div class="flex flex-col gap-8">
		{#each Object.keys(bookData).sort().reverse() as year (year)}
			{@const yearBooks = bookData[year]}
			<div class="grid gap-3">
				<span>
					<h2 class="mr-3 inline-block text-2xl font-bold">{year}</h2>
					<span>{yearBooks!.length} {yearBooks!.length > 1 ? 'books' : 'book'}</span>
				</span>
				<div class="grid grid-cols-[repeat(auto-fill,_minmax(12rem,_1fr))] gap-6">
					{#each yearBooks as book (book.isbn)}
						<Book
							title={book.title}
							author={book.author}
							cover_image="/covers/book-{book.isbn}.webp"
							subtitle={book.subtitle}
						/>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</main>
