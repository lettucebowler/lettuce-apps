<script lang="ts">
  import { page } from '$app/state';
  import './layout.css';
  import { NavBar, NavLink } from '@lettuce-apps-packages/svelte-common';
  let { children } = $props();
</script>

<svelte:head
  ><link
    rel="icon"
    href="https://api.dicebear.com/9.x/bottts-neutral/svg?backgroundColor=BF616A&backgroundColor=D08770&backgroundColor=EBCB8B&backgroundColor=A3BE8C&backgroundColor=B48EAD&backgroundColor=88C0D0&backgroundType=gradientLinear&radius=20&seed=lettucebowler"
  /></svelte:head
>
<div class="mx-auto h-full space-y-16">
  <div class="container mx-auto box-border">
    <div class="mx-2 mt-2">
      <NavBar>
        <NavLink to="/" class="hover:underline">Home</NavLink>
        <NavLink to="/posts" current={page.url.pathname.startsWith('/posts')} class="hover:underline">Posts</NavLink>
        <NavLink to="/projects" class="hover:underline">Projects</NavLink>
        <NavLink to="/reading-log" class="hover:underline">Books</NavLink>
        <NavLink to="/movie-log" class="hover:underline">Movies</NavLink>
        <a
          href="https://github.com/lettucebowler"
          class="hidden sm:ml-auto sm:flex sm:items-center"
          title="Github profile"
        >
          <span class="icon-[mdi--github] size-7 text-swamp-green-500"></span>
        </a>
        <a href="/Resume.pdf" target="_blank" class="hidden sm:flex sm:items-center" title="Resume">
          <span class="icon-[heroicons--document-text-solid] size-7 text-antique-brass-500"></span>
        </a>
      </NavBar>
    </div>
  </div>
  <div class="container mx-auto px-6 pb-4">
    {@render children()}
  </div>
</div>
