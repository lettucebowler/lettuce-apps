import { prerender } from '$app/server';

import * as collections from './collections.server';
import { DateRange, Integer, PostTag } from './schemas';

export const getProjectsDesc = prerender(() => collections.getProjectsDesc());

export const getMoviesDesc = prerender(() => collections.getMoviesDesc(), { dynamic: true });

export const getBooksDesc = prerender(() => collections.getBooksDesc(), { dynamic: true });

export const getCurrentlyReading = prerender(() => collections.getCurrentlyReading());

export const getActiveProjects = prerender(() => collections.getActiveProjects());

export const getLastReadBook = prerender(() => collections.getLastReadBook());

export const getLastWatchedMovie = prerender(() => collections.getLastWatchedMovie());

export const getRecentPosts = prerender(Integer, (count) => collections.getRecentPosts(count));

export const getBooksInDateRange = prerender(DateRange, (dateRange) => collections.getBooksInDateRange(dateRange));

export const getMoviesInDateRange = prerender(DateRange, (dateRange) => collections.getMoviesInDateRange(dateRange));

export const getMovieLogsDesc = prerender(() => collections.getMovieLogsDesc());

export const getReadingLogsDesc = prerender(() => collections.getReadingLogsDesc());

export const getAllPostTags = prerender(() => collections.getAllPostTags());

export const getPostsByYear = prerender(() => collections.getPostsByYear());

export const getPostsByYearWithTag = prerender(PostTag, (tag) => collections.getPostsByYear(tag));
