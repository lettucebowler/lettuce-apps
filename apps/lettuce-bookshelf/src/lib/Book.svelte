<script lang="ts">
	type BookProps = {
		title: string;
		subtitle?: string;
		author: string;
		cover_image: string;
		link?: string;
		year?: string;
	};

	let { title, subtitle, author, cover_image, link, year } = $props();
</script>

{#if link}
	<a href={link} class="block w-full">
		{@render bookFigure({ title, subtitle, author, cover_image })}
	</a>
{:else}
	{@render bookFigure({ title, subtitle, author, cover_image })}
{/if}

{#snippet bookFigure({ title, subtitle, author, cover_image }: Omit<BookProps, 'link'>)}
	<figure class="flex flex-col gap-2">
		<img
			class="aspect-2/3 w-full rounded shadow-sm"
			alt={`${title}${subtitle ? ': ' + subtitle : ''}`}
			src={cover_image}
		/>
		<figcaption>
			<h3 class="font-medium">{title}</h3>
			{#if subtitle}
				<p class="">{subtitle}</p>
			{/if}
			<div class="flex justify-between text-sm">
				<p>{author}</p>
				{#if year}
					<p>{year}</p>
				{/if}
			</div>
		</figcaption>
	</figure>
{/snippet}
