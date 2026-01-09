import { appName } from '$lib/app-constants';

export function load(event) {
  return {
    title: `${event.params.profileUser} | ${appName}`,
  };
}
