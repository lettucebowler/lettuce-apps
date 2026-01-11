<script lang="ts">
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
<div class="container mx-auto h-full space-y-10 xl:max-w-screen-xl">
  <nav class="flex flex-wrap gap-x-4 gap-y-1">
    <NavLink to="/"><span class="text-lg font-bold hover:underline">Home</span></NavLink>
    <!-- <NavLink to="/posts"><span class="text-lg font-bold hover:underline">Posts</span></NavLink> -->
    <NavLink to="/projects"><span class="text-lg font-bold hover:underline">Projects</span></NavLink
    >
    <NavLink to="/books"><span class="text-lg font-bold hover:underline">Books</span></NavLink>
    <NavLink to="/movies"><span class="text-lg font-bold hover:underline">Movies</span></NavLink>
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
