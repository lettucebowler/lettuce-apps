<script lang="ts">
  import { page } from '$app/state';
  import './layout.css';
  import NavLink from './NavLink.svelte';
  import GithubIcon from './GithubIcon.svelte';
  import ResumeIcon from 'phosphor-svelte/lib/FileTextIcon';
  let { children } = $props();
</script>

<svelte:head
  ><link
    rel="icon"
    href="https://api.dicebear.com/9.x/bottts-neutral/svg?backgroundColor=BF616A&backgroundColor=D08770&backgroundColor=EBCB8B&backgroundColor=A3BE8C&backgroundColor=B48EAD&backgroundColor=88C0D0&backgroundType=gradientLinear&radius=20&seed=lettucebowler"
  /></svelte:head
>
<div class="h-full space-y-16">
  <div class="bg-charade-950">
    <nav
      class="container mx-auto flex flex-wrap justify-center gap-x-4 gap-y-1 px-4 py-2 font-bold sm:justify-start sm:text-xl"
    >
      <NavLink to="/" class="pt-1 hover:underline">Home</NavLink>
      <NavLink to="/posts" current={page.url.pathname.startsWith('/posts')} class="pt-1 hover:underline">Posts</NavLink>
      <NavLink to="/projects" class="pt-1 hover:underline">Projects</NavLink>
      <NavLink to="/reading-log" class="pt-1 hover:underline">Books</NavLink>
      <NavLink to="/movie-log" class="pt-1 hover:underline">Movies</NavLink>
      <a
        href="https://github.com/lettucebowler"
        class="hidden sm:ml-auto sm:flex sm:items-center"
        title="Github profile"
      >
        <GithubIcon class="size-6 fill-swamp-green-500" />
      </a>
      <a href="/Resume.pdf" target="_blank" class="hidden sm:flex sm:items-center" title="Resume">
        <ResumeIcon class="size-7 text-antique-brass-500" weight="fill" />
      </a>
    </nav>
  </div>
  <div class="container mx-auto px-4 pb-5">
    {@render children()}
  </div>
</div>
