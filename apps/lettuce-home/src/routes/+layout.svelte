<script lang="ts">
  import { page } from '$app/state';
  import './layout.css';
  import NavLink from './NavLink.svelte';
  import GithubIcon from './GithubIcon.svelte';
  import ResumeIcon from './ResumeIcon.svelte';
  let { children } = $props();
</script>

<svelte:head
  ><link
    rel="icon"
    href="https://api.dicebear.com/9.x/bottts-neutral/svg?backgroundColor=BF616A&backgroundColor=D08770&backgroundColor=EBCB8B&backgroundColor=A3BE8C&backgroundColor=B48EAD&backgroundColor=88C0D0&backgroundType=gradientLinear&radius=20&seed=lettucebowler"
  /></svelte:head
>
<div
  class="mx-auto h-full space-y-16 p-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl"
>
  <nav class="flex flex-wrap justify-center gap-x-4 gap-y-1 font-bold sm:justify-start sm:text-xl">
    <NavLink to="/"><span class="hover:underline">Home</span></NavLink>
    <NavLink to="/posts" current={page.url.pathname.startsWith('/posts')}
      ><span class="hover:underline">Posts</span></NavLink
    >
    <NavLink to="/projects"><span class="hover:underline">Projects</span></NavLink>
    <NavLink to="/books"><span class="hover:underline">Books</span></NavLink>
    <NavLink to="/movies"><span class="hover:underline">Movies</span></NavLink>
    <a
      href="https://github.com/lettucebowler"
      class="hidden sm:ml-auto sm:inline"
      title="Github profile"
    >
      <GithubIcon class="size-6 fill-swamp-green-500" />
    </a>
    <a href="/Resume.pdf" target="_blank" class="hidden sm:inline" title="Resume">
      <ResumeIcon class="size-6 text-antique-brass-500" />
    </a>
  </nav>
  <div>
    {@render children()}
  </div>
</div>
