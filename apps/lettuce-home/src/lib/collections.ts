import { parseDate } from '@internationalized/date';
import type { DateRange } from 'bits-ui';
import { allMovieLogs, allProjects, allReadingLogs, allPosts, currentlyReading } from 'content-collections';

export function getLastWatchedMovie() {
  return getMovieLogsDesc().at(0)!.movies.at(0)!;
}

export function getMovieLogsDesc() {
  return allMovieLogs.sort((a, b) => {
    return b.year - a.year;
  });
}

export function getCurrentlyReading() {
  return currentlyReading.books;
}

export function getReadingLogsDesc() {
  return allReadingLogs
    .sort((a, b) => {
      return (b.title as number) - (a.title as number);
    })
    .map((log) => {
      return {
        title: log.title.toString(),
        items: log.books,
      };
    });
}

export function filterBooks(dateRange: DateRange) {
  return getReadingLogsDesc()
    .map((log) => log.items)
    .flat()
    .filter((item) => {
      const completionDate = parseDate(item.completed);
      return (
        (!dateRange.start || completionDate >= dateRange.start) && (!dateRange.end || completionDate <= dateRange.end)
      );
    });
}

export function filterMovies(dateRange: DateRange) {
  return getMovieLogsDesc()
    .map((log) => log.movies)
    .flat()
    .filter((item) => {
      const completionDate = parseDate(item.watched);
      return (
        (!dateRange.start || completionDate >= dateRange.start) && (!dateRange.end || completionDate <= dateRange.end)
      );
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
        .flat(),
    ),
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
