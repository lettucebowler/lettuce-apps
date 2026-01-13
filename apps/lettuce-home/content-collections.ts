import { MovieLog, Post, Project, ReadingLog } from './src/lib/schemas';
import { defineCollection, defineConfig } from '@content-collections/core';

const posts = defineCollection({
  name: 'posts',
  directory: 'src/content/posts',
  include: '*.md',
  schema: Post,
  parser: 'frontmatter-only',
  transform: async (doc, context) => {
    return {
      ...doc,
      slug: doc._meta.path
    };
  }
});

const movieLogs = defineCollection({
  name: 'movieLogs',
  directory: 'src/content/movie-log',
  include: '*.yaml',
  schema: MovieLog,
  parser: 'yaml'
});

const readingLogs = defineCollection({
  name: 'readingLogs',
  directory: 'src/content/reading-log',
  include: '*.yaml',
  schema: ReadingLog,
  parser: 'yaml'
});

const projects = defineCollection({
  name: 'projects',
  directory: 'src/content/projects',
  include: '*.yaml',
  schema: Project,
  parser: 'yaml'
});

export default defineConfig({
  collections: [posts, movieLogs, readingLogs, projects]
});
