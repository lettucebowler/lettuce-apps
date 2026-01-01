<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavLink from './NavLink.svelte';
	import TwitterIcon from './TwitterIcon.svelte';
	import GithubIcon from './GithubIcon.svelte';
	import ResumeIcon from './ResumeIcon.svelte';
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<nav class="flex gap-4">
	<NavLink to="/"
		><span class="block px-2 py-1 text-lg font-bold first-letter:capitalize">home</span></NavLink
	>
	<NavLink to="/projects"
		><span class="block px-2 py-1 text-lg font-bold first-letter:capitalize">projects</span
		></NavLink
	>
	<NavLink to="/bookshelf"
		><span class="block px-2 py-1 text-lg font-bold first-letter:capitalize">bookshelf</span
		></NavLink
	>
	<a href="https://twitter.com/lettucebowler" class="ml-auto">
		<TwitterIcon />
	</a>
	<a href="https://github.com/lettucebowler">
		<GithubIcon />
	</a>
	<a href="/Resume.pdf">
		<div class="h-full w-6">
			<ResumeIcon />
		</div>
	</a>
</nav>
<div class="container mx-auto max-w-screen-xl pt-6">
	{@render children()}
</div>
