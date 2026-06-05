import type { Post } from '$lib/schemas.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  try {
    const post = await import(`$lib/../content/posts/${params.year}/${params.slug}.md`);
    return {
      content: post.default,
      meta: post.metadata as Post,
    };
  } catch (e) {
    console.log(e);
    error(404, `Could not find ${params.slug}`);
  }
}
