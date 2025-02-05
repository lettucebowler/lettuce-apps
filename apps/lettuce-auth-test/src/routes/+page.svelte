<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

{#if data.authenticated}
	<p>hello {data.session.username}</p>
	<img
		class="pointer-events-none inline aspect-square h-32 w-32 w-full rounded-xl"
		src="https://api.dicebear.com/7.x/bottts-neutral/svg?backgroundColor=BF616A&backgroundColor=D08770&backgroundColor=EBCB8B&backgroundColor=A3BE8C&backgroundColor=B48EAD&backgroundColor=88C0D0&backgroundColor=81A1C1&seed={encodeURIComponent(
			data.session.username
		)}"
		alt="{data.session.username} avatar image"
	/>
{:else}
	<p>Hey stranger</p>
	<a href={data.loginUrl}>login</a>
{/if}
