import { parseDate } from '@internationalized/date';
import { getMoviesInDateRange, getBooksInDateRange, dedupe } from './collections';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export type MediaData = {
  month: string;
  books: number;
  movies: number;
};

export function getBarChartData(year: number): MediaData[] {
  const dateRange = { start: parseDate(`${year}-01-01`), end: parseDate(`${year}-12-31`) };
  let yearBooks = getBooksInDateRange(dateRange);
  let yearMovies = getMoviesInDateRange(dateRange);
  return months.map((month, index) => {
    const monthNum = index + 1;
    const monthBooks = dedupe(
      yearBooks.filter((book) => parseDate(book.logDate).month === monthNum),
      (book) => book.isbn,
    );
    const monthMovies = dedupe(
      yearMovies.filter((movie) => parseDate(movie.logDate).month === monthNum),
      (movie) => movie.tmdb,
    );
    return {
      month,
      books: monthBooks.length,
      movies: monthMovies.length,
    };
  });
}
