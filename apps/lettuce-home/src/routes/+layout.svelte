<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import NavLink from './NavLink.svelte';
  import GithubIcon from './GithubIcon.svelte';
  import ResumeIcon from './ResumeIcon.svelte';
  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="container mx-auto flex h-full flex-col gap-6 xl:max-w-screen-xl">
  <nav class="flex flex-wrap gap-x-4 gap-y-1">
    <NavLink to="/"><span class="text-lg font-bold hover:underline">Home</span></NavLink>
    <NavLink to="/projects"><span class="text-lg font-bold hover:underline">Projects</span></NavLink
    >
    <NavLink to="/books"><span class="text-lg font-bold hover:underline">Books</span></NavLink>
    <NavLink to="/movies"><span class="text-lg font-bold hover:underline">Movies</span></NavLink>
    <a
      href="https://github.com/lettucebowler"
      class="hidden sm:ml-auto sm:inline"
      title="Github profile"
    >
      <GithubIcon class="size-6 fill-swamp-green-500 " />
    </a>
    <a href="/Resume.pdf" target="_blank" class="hidden sm:inline" title="Resume">
      <ResumeIcon class="size-6 text-antique-brass-500" />
    </a>
  </nav>
  {@render children()}
</div>
