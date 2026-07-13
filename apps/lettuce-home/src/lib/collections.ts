import { parseDate } from '@internationalized/date';
import type { DateRange } from 'bits-ui';
import { allMovieLogs, allProjects, allReadingLogs, allPosts, currentlyReading } from 'content-collections';
import type { Book, MovieLogEntry, Post } from './schemas';

function getMoviesAsc() {
  const moviesMap: Map<number, MovieLogEntry> = new Map();
  return allMovieLogs
    .sort((a, b) => a.year - b.year)
    .flatMap((log) => log.movies.toReversed())
    .map((movie) => {
      const prev = moviesMap.get(movie.tmdb);
      if (!prev) {
        moviesMap.set(movie.tmdb, movie);
        return movie;
      }
      return {
        ...movie,
        rewatch: true,
      };
    });
}

function getBooksAsc() {
  const booksMap: Map<string, Book> = new Map();
  return allReadingLogs
    .sort((a, b) => a.year - b.year)
    .flatMap((log) => log.books.toReversed())
    .map((book) => {
      const prev = booksMap.get(book.isbn);
      if (!prev) {
        booksMap.set(book.isbn, book);
        return book;
      }
      return {
        ...book,
        reread: true,
      };
    });
}

export function getLastWatchedMovie() {
  return getMoviesAsc().at(-1)!;
}

export function getMovieLogsDesc() {
  const groups = Object.groupBy(getMoviesAsc(), (movie) => movie.logDate.substring(0, 4));
  return Object.keys(groups)
    .toSorted()
    .toReversed()
    .map((year) => {
      return {
        year: Number(year),
        movies: groups[year]!.toReversed(),
      };
    });
}

export function getCurrentlyReading() {
  return currentlyReading.books;
}

export function getReadingLogsDesc() {
  const groups = Object.groupBy(getBooksAsc(), (book) => book.logDate.substring(0, 4));
  return Object.keys(groups)
    .toSorted()
    .toReversed()
    .map((year) => {
      return {
        year: Number(year),
        books: groups[year]!.toReversed(),
      };
    });
}

export function filterBooks(dateRange: DateRange) {
  return getBooksAsc()
    .toReversed()
    .filter((item) => {
      const completionDate = parseDate(item.logDate);
      return (
        (!dateRange.start || completionDate >= dateRange.start) && (!dateRange.end || completionDate <= dateRange.end)
      );
    });
}

export function filterMovies(dateRange: DateRange) {
  return getMoviesAsc()
    .toReversed()
    .filter((item) => {
      const completionDate = parseDate(item.logDate);
      return (
        (!dateRange.start || completionDate >= dateRange.start) && (!dateRange.end || completionDate <= dateRange.end)
      );
    });
}

export function getLastReadBook() {
  return getBooksAsc().at(-1)!;
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
