import type { Post } from '$lib/schemas.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  try {
    const post = await import(`../../../content/posts/${params.slug}.md`);
    return {
      content: post.default,
      meta: post.metadata as Post
    };
  } catch (e) {
    error(404, `Could not find ${params.slug}`);
  }
}

export const prerender = false;
