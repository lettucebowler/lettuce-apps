<script lang="ts">
	type BookProps = {
		title: string;
		subtitle?: string;
		author: string;
		cover_image: string;
	};

	let { title, subtitle, author, cover_image }: BookProps = $props();
</script>

<div class="@container">
	<figure class="grid grid-cols-1 gap-2 @xs:grid-cols-[2fr_3fr]">
		<img
			class="aspect-2/3 w-full max-w-60 rounded shadow-sm"
			alt={`${title}${subtitle ? ': ' + subtitle : ''}`}
			src={cover_image}
		/>
		<figcaption>
			<h3 class="font-medium">{title}</h3>
			{#if subtitle}
				<p class="">{subtitle}</p>
			{/if}
			<p>{author}</p>
		</figcaption>
	</figure>
</div>
