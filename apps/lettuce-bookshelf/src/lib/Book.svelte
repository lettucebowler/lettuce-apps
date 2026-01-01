<script lang="ts">
	type BookProps = {
		title: string;
		subtitle?: string;
		author: string;
		cover_image: string;
	};

	let { title, subtitle, author, cover_image } = $props();
</script>

<div class="@container">
	<figure class="grid grid-cols-1 gap-2 max-[464px]:grid-cols-[5rem_1fr] max-[464px]:gap-4">
		<img
			class="aspect-2/3 w-full rounded shadow-sm max-[464px]:w-20"
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
