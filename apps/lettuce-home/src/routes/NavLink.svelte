<script module lang="ts">
	import { crossfade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const [send, recieve] = crossfade({
		duration: 250,
		easing: cubicOut
	});
</script>

<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	type Props =
		| {
				to: string;
				class?: string;
				children?: undefined;
		  }
		| {
				to: string;
				class?: string;
				children: Snippet<[]>;
		  };

	let { to, class: className, children }: Props = $props();

	let current = $derived(page.url.pathname === to);
</script>

<a class={[className]} aria-current={current} href={to}>
	<div class={['z-10']}>
		{@render children?.()}
	</div>
	{#if current}
		<div
			in:recieve={{ key: 'current-link' }}
			out:send={{ key: 'current-link' }}
			class="border-box mx-4 h-1 bg-charade-700"
		></div>
	{/if}
</a>
