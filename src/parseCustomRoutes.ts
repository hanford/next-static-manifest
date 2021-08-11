import findUp from 'find-up';
import { CONFIG_FILE } from 'next/constants';
import loadCustomRoutes, {
  normalizeRouteRegex,
} from 'next/dist/lib/load-custom-routes';
import { defaultConfig } from 'next/dist/server/config-shared';
import { pathToRegexp } from 'path-to-regexp';

// import { RouteEntry } from './utils';

function createMap(route: { source: string; destination: string }) {
  const routeRegex = pathToRegexp(route.source, [], {
    strict: true,
    sensitive: false,
    delimiter: '/', // default is `/#?`, but Next does not pass query info
  });

  let regexSource = routeRegex.source;

  return {
    src: route.source,
    dest: route.destination,
    regex: normalizeRouteRegex(regexSource),
    dynamic: true,
  };
}

export default async function parseCustomRoutes(dir: string) {
  const path = await findUp(CONFIG_FILE, { cwd: dir });

  if (path?.length) {
    const userConfigModule = require(path);

    const userConfig = { ...defaultConfig, ...userConfigModule };

    const { rewrites: _rewrites } = await loadCustomRoutes(userConfig);

    const rewrites = {
      beforeFiles: _rewrites.beforeFiles.map(createMap),
      afterFiles: _rewrites.afterFiles.map(createMap),
    };

    return rewrites;
  }

  return { beforeFiles: [], afterFiles: [] };
}
