import { appName } from '$lib/app-constants';
import { getGameNum } from '$lib/words';

export function load() {
  return {
    title: `${appName} #${getGameNum()}`,
    metaTitle: appName,
  };
}
