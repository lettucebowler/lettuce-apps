import { prerender, query } from '$app/server';
import * as v from 'valibot';

import { allMovieLogs, allPosts, allProjects, allReadingLogs, currentBook } from 'content-collections';

export const getMovieLogsDesc = prerender(() => {
  return allMovieLogs.sort((a, b) => {
    return b.year - a.year;
  });
});

export const getLastWatchedMovie = prerender(async () => {
  const logs = await getMovieLogsDesc();
  return logs[0].movies[0];
});

export const getReadingLogsDesc = prerender(() => {
  return allReadingLogs
    .sort((a, b) => {
      return (b.title as number) - (a.title as number);
    })
    .map((log) => {
      return { title: log.title.toString(), items: log.books };
    });
});

export const getCurrentlyReading = prerender(() => {
  return currentBook.books.map((book) => {
    return {
      ...book,
      reread: false
    };
  });
});

export const filterBooks = query(
  v.object({
    start: v.pipe(v.string(), v.isoDate()),
    end: v.pipe(v.string(), v.isoDate())
  }),
  async ({ start, end }) => {
    const logs = await getReadingLogsDesc();
    return logs.flatMap((log) => log.items).filter((item) => item.completed >= start && item.completed <= end);
  }
);

export const filterMovies = query(
  v.object({
    start: v.pipe(v.string(), v.isoDate()),
    end: v.pipe(v.string(), v.isoDate())
  }),
  async ({ start, end }) => {
    const logs = await getMovieLogsDesc();
    return logs.flatMap((log) => log.movies).filter((item) => item.watched >= start && item.watched <= end);
  }
);

export const getLastReadBook = prerender(async () => {
  const logs = await getReadingLogsDesc();
  return logs[0].items[0];
});

export const getProjectsDesc = prerender(() => {
  return allProjects.toReversed();
});

export const getActiveProjects = prerender(async () => {
  const projects = await getProjectsDesc();
  return projects.filter((project) => project.status === 'active');
});

export const allPostsDesc = prerender(() => {
  return allPosts
    .filter((post) => Boolean(post.published))
    .toSorted((a, b) => {
      return b.date > a.date ? 1 : -1;
    });
});

export const getPost = prerender(v.string(), async (slug) => {
  return allPosts.find((post) => post.slug === slug);
});

export const getRecentPosts = prerender(async () => {
  const posts = await allPostsDesc();
  return posts.slice(0, 5);
});

export const getPostsWithTag = prerender(v.optional(v.string()), async (tag) => {
  const posts = await allPostsDesc();
  if (!tag) {
    return posts;
  }
  return posts.filter((post) => post.tags?.includes(tag));
});

export const getAllPostTags = prerender(async () => {
  const posts = await allPostsDesc();
  return Array.from(new Set(posts.map((post) => post.tags ?? []).flat())).toSorted();
});

export const getPostsByYear = prerender(v.optional(v.string()), async (tag) => {
  const posts = await getPostsWithTag(tag);
  const grouped = Object.groupBy(posts, (post) => {
    return post.date.slice(0, 4);
  });

  return [...Object.entries(grouped)]
    .toSorted((a, b) => (a[0] < b[0] ? 1 : -1))
    .map((group) => ({ title: group[0], items: group[1]! }));
});
