import { parseDate } from '@internationalized/date';
import type { DateRange } from 'bits-ui';
import { allMovieLogs, allProjects, allReadingLogs, allPosts, currentlyReading } from 'content-collections';
import type { Post } from './schemas';

function getMoviesDesc() {
  return allMovieLogs.sort((a, b) => b.year - a.year).flatMap((log) => log.movies);
}

function getBooksDesc() {
  return allReadingLogs.sort((a, b) => b.year - a.year).flatMap((log) => log.books);
}

export function dedupe<T extends any, K extends any>(items: Array<T>, keyFunc: (item: T) => K) {
  let itemMap: Map<K, T> = new Map();
  return items.filter((item) => {
    const key = keyFunc(item);
    const prev = itemMap.get(key);
    if (!prev) {
      itemMap.set(key, item);
      return true;
    } else {
      return false;
    }
  });
}

export function getLastWatchedMovie() {
  return getMoviesDesc().at(0)!;
}

export function getMovieLogsDesc() {
  return allMovieLogs
    .sort((a, b) => b.year - a.year)
    .map((log) => {
      return {
        year: log.year,
        movies: dedupe(log.movies.toReversed(), (movie) => movie.tmdb).toReversed(),
      };
    });
}

export function getCurrentlyReading() {
  return currentlyReading.books;
}

export function getReadingLogsDesc() {
  return allReadingLogs
    .sort((a, b) => b.year - a.year)
    .map((log) => {
      return {
        year: log.year,
        books: dedupe(log.books.toReversed(), (book) => book.isbn).toReversed(),
      };
    });
}

export function getBooksInDateRange(dateRange: DateRange) {
  return getBooksDesc().filter((item) => {
    const completionDate = parseDate(item.logDate);
    return (
      (!dateRange.start || completionDate >= dateRange.start) && (!dateRange.end || completionDate <= dateRange.end)
    );
  });
}

export function getMoviesInDateRange(dateRange: DateRange) {
  return getMoviesDesc().filter((item) => {
    const completionDate = parseDate(item.logDate);
    return (
      (!dateRange.start || completionDate >= dateRange.start) && (!dateRange.end || completionDate <= dateRange.end)
    );
  });
}

export function getLastReadBook() {
  return getBooksDesc().at(0)!;
}

export function getProjectsDesc() {
  return allProjects.toReversed();
}

export function getActiveProjects() {
  return getProjectsDesc()
    .filter((project) => project.status === 'active')
    .map((project) => {
      const { _meta, ...rest } = project;
      return rest;
    });
}

export function allPostsDesc() {
  return allPosts
    .filter((post) => Boolean(post.published))
    .toSorted((a, b) => {
      return b.date > a.date ? 1 : -1;
    });
}

export function getPost(slug: string) {
  return allPosts.find((post) => post.slug === slug);
}

export function getRecentPosts(count: number) {
  return allPostsDesc().slice(0, count);
}

export function getPostsWithTag(tag?: string | null) {
  if (!tag) {
    return allPostsDesc();
  }
  return allPostsDesc().filter((post) => post.tags?.includes(tag));
}

export function filterPosts(filter: (post: Post) => boolean = () => true) {
  return allPostsDesc().filter(filter);
}

export function getAllPostTags() {
  return Array.from(
    new Set(
      allPostsDesc()
        .map((post) => post.tags ?? [])
        .flat(),
    ),
  ).toSorted();
}

export function getPostsByYear(filter: (post: Post) => boolean = () => true) {
  const grouped = Object.groupBy(filterPosts(filter), (post) => {
    return post.date.slice(0, 4);
  });

  return [...Object.entries(grouped)]
    .toSorted((a, b) => (a[0] < b[0] ? 1 : -1))
    .map((group) => ({ title: group[0], items: group[1]! }));
}
