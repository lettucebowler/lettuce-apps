import {
  getActiveProjects,
  getCurrentlyReading,
  getLastReadBook,
  getLastWatchedMovie,
  getRecentPosts,
} from '#lib/collections.remote.js';
import { prerender } from '$app/server';

export const getHomepageData = prerender(async () => {
  return {
    latestBook: await getLastReadBook(),
    activeProjects: await getActiveProjects(),
    latestMovie: await getLastWatchedMovie(),
    recentPosts: await getRecentPosts(4),
    currentBooks: await getCurrentlyReading(),
  };
});
