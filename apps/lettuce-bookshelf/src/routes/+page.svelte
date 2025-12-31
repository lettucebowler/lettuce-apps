<script lang="ts">
	import { getBooks } from '$lib/remote/book.remote';
	import Book from '$lib/Book.svelte';

	const bookData = await getBooks();
</script>

<main class="container mx-auto flex flex-col">
	<h1 class="mb-4 text-3xl font-bold first-letter:capitalize">bookshelf</h1>
	<div class="flex flex-col gap-8">
		{#each [...new Set(bookData.map((book) => book.log_date.substring(0, 4)))] as year (year)}
			<div>
				<h2 class="mb-2 text-2xl font-bold">{year}</h2>
				<div
					class="grid grid-cols-2 gap-8 max-[400px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
				>
					{#each bookData.filter((b) => b.log_date.startsWith(year)) as book (book.isbn)}
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
