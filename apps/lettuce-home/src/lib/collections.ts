import type { MovieLogEntry, ReadingLogEntry } from '$lib/schemas';
import { allMovieLogs, allProjects, allReadingLogs, allPosts } from 'content-collections';

export function getLastWatchedMovie(): MovieLogEntry {
  return getMovieLogsDesc().at(0)!.movies.at(0)!;
}

export function getMovieLogsDesc() {
  return allMovieLogs.sort((a, b) => {
    return b.year - a.year;
  });
}

export function getCurrentlyReading() {
  return allReadingLogs.find((log) => log.year === 'current')!.books;
}

export function getReadingLogsDesc() {
  return allReadingLogs
    .filter((log) => log.year !== 'current')
    .sort((a, b) => {
      return (b.year as number) - (a.year as number);
    })
    .map((log) => {
      return { title: log.year.toString(), items: log.books };
    });
}

export function getFilteredBooks({
  years,
  months
}: {
  years: Array<number | 'current'>;
  months: string[];
}) {
  return allReadingLogs
    .filter((log) => years.includes(log.year))
    .map((log) => log.books)
    .flat()
    .filter((book) => {
      if (!months.length) {
        return true;
      }
      if (!book.completed) {
        return false;
      }
      const [, bookMonth] = book.completed.split('-');
      return months.includes(bookMonth);
    });
}

export function filterBooks(selector: (book: ReadingLogEntry) => Boolean) {
  return getReadingLogsDesc()
    .map((log) => log.items)
    .flat()
    .filter(selector);
}

export function getFilteredMovies({ years, months }: { years: number[]; months: string[] }) {
  return allMovieLogs
    .filter((log) => years.includes(log.year))
    .map((log) => log.movies)
    .flat()
    .filter((book) => {
      if (!months.length) {
        return true;
      }
      const [, movieMonth] = book.watched.split('-');
      return months.includes(movieMonth);
    });
}

export function filterMovies(selector: (movie: MovieLogEntry) => Boolean) {
  return getMovieLogsDesc()
    .map((log) => log.movies)
    .flat()
    .filter(selector);
}

export function getLastReadBook() {
  return getReadingLogsDesc()[0].items.at(0)!;
}

export function getProjectsDesc() {
  return allProjects.toReversed();
}

export function getActiveProjects() {
  return getProjectsDesc().filter((project) => project.status === 'active');
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

export function getRecentPosts() {
  return allPostsDesc().slice(0, 5);
}

export function getPostsWithTag(tag?: string | null) {
  if (!tag) {
    return allPostsDesc();
  }
  return allPostsDesc().filter((post) => post.tags?.includes(tag));
}

export function getAllPostTags() {
  return Array.from(
    new Set(
      allPostsDesc()
        .map((post) => post.tags ?? [])
        .flat()
    )
  ).toSorted();
}

export function getPostsByYear(tag?: string | null) {
  const grouped = Object.groupBy(getPostsWithTag(tag), (post) => {
    return post.date.slice(0, 4);
  });

  return [...Object.entries(grouped)]
    .toSorted((a, b) => (a[0] < b[0] ? 1 : -1))
    .map((group) => ({ title: group[0], items: group[1]! }));
}
