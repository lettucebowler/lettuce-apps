import type { MovieLogEntry } from '$lib/schemas';
import { allMovieLogs, allProjects, allReadingLogs } from 'content-collections';

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

export function getLastReadBook() {
  return getReadingLogsDesc()[0].items.at(0)!;
}

export function getProjectsDesc() {
  return allProjects.toReversed();
}

export function getActiveProjects() {
  return getProjectsDesc().filter((project) => project.status === 'active');
}
