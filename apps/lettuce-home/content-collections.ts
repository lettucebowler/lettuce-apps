import { Post } from './src/lib/schemas';
import { defineCollection, defineConfig } from '@content-collections/core';

const posts = defineCollection({
  name: 'posts',
  directory: 'src/content/posts',
  include: '*.md',
  schema: Post,
  transform: async (doc, context) => {
    return {
      ...doc,
      slug: doc._meta.path
    };
  }
});

export default defineConfig({
  collections: [posts]
});
