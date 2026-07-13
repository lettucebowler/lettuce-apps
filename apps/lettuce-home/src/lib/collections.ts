import { parseDate } from '@internationalized/date';
import type { DateRange } from 'bits-ui';
import { allMovieLogs, allProjects, allReadingLogs, allPosts, currentlyReading } from 'content-collections';
import type { Book, Post } from './schemas';

export function getLastWatchedMovie() {
  return getMovieLogsDesc().at(0)!.movies.at(0)!;
}

export function getMovieLogsDesc() {
  return allMovieLogs
    .sort((a, b) => {
      return b.year - a.year;
    })
    .map((log) => {
      return {
        year: log.year,
        movies: log.movies,
      };
    });
}

export function getCurrentlyReading() {
  return currentlyReading.books;
}

export function getReadingLogsDesc() {
  const bookMap: Map<string, Book> = new Map();
  const books = allReadingLogs.flatMap((log) => log.books.toReversed());
  const checked = books.map((book) => {
    const prev = bookMap.get(book.isbn);
    if (!prev) {
      bookMap.set(book.isbn, book);
      return book;
    } else {
      return {
        ...book,
        reread: true,
      };
    }
  });
  const groups = Object.groupBy(checked, (book) => book.logDate.substring(0, 4));
  return Object.keys(groups)
    .toSorted()
    .toReversed()
    .map((key) => ({
      year: key,
      books: groups[key]!.toReversed(),
    }));
}

export function filterBooks(dateRange: DateRange) {
  return allReadingLogs
    .flatMap((log) => log.books.toReversed())
    .toReversed()
    .filter((item) => {
      const completionDate = parseDate(item.logDate);
      return (
        (!dateRange.start || completionDate >= dateRange.start) && (!dateRange.end || completionDate <= dateRange.end)
      );
    });
}

export function filterMovies(dateRange: DateRange) {
  return getMovieLogsDesc()
    .flatMap((log) => log.movies)
    .filter((item) => {
      const completionDate = parseDate(item.logDate);
      return (
        (!dateRange.start || completionDate >= dateRange.start) && (!dateRange.end || completionDate <= dateRange.end)
      );
    });
}

export function getLastReadBook() {
  return getReadingLogsDesc()[0].books.at(0)!;
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
