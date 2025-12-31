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

<div class="@container">
	{#if link}
		<a href={link} class="block w-full">
			{@render bookFigure({ title, subtitle, author, cover_image })}
		</a>
	{:else}
		{@render bookFigure({ title, subtitle, author, cover_image })}
	{/if}
</div>

{#snippet bookFigure({ title, subtitle, author, cover_image }: Omit<BookProps, 'link'>)}
	<figure class="grid grid-cols-1 gap-2 @2xs:grid-cols-[5rem_1fr] @2xs:gap-4">
		<img
			class="aspect-2/3 w-full rounded shadow-sm @2xs:w-20"
			alt={`${title}${subtitle ? ': ' + subtitle : ''}`}
			src={cover_image}
		/>
		<figcaption>
			<h3 class="font-medium">{title}</h3>
			{#if subtitle}
				<p class="">{subtitle}</p>
			{/if}
			<div class="flex justify-between text-sm @2xs:mt-auto @2xs:flex-col @2xs:justify-start">
				<p>{author}</p>
				{#if year}
					<p>{year}</p>
				{/if}
			</div>
		</figcaption>
	</figure>
{/snippet}
