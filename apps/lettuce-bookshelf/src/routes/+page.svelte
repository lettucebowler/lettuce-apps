<script lang="ts">
	import { getBooks } from '$lib/remote/book.remote';
	import Book from '$lib/Book.svelte';

	const bookData = await getBooks();
</script>

<main class="container mx-auto flex flex-col">
	<h1 class="mb-4 text-3xl font-bold first-letter:capitalize">bookshelf</h1>
	<div class="flex flex-col gap-8">
		{#each [...new Set(bookData.map((book) => book.log_date.substring(0, 4)))] as year (year)}
			{@const yearBooks = bookData.filter((b) => b.log_date.startsWith(year))}
			<div class="grid gap-3">
				<span>
					<h2 class="mr-3 inline-block text-2xl font-bold">{year}</h2>
					<span>{yearBooks.length} {yearBooks.length > 1 ? 'books' : 'book'}</span>
				</span>
				<div class="grid grid-cols-[repeat(auto-fill,_minmax(12rem,_1fr))] gap-x-12 gap-y-8">
					{#each yearBooks as book (book.isbn)}
						<Book
							title={book.title}
							author={book.author_name}
							link={book.link}
							cover_image={book.cover_image}
							subtitle={book.subtitle}
							year={book.first_publish_year}
						/>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</main>
