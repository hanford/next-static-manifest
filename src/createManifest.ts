import { join } from 'path';
import { cwd } from 'process';
import {
  getRouteRegex,
  isDynamicRoute,
} from 'next/dist/next-server/lib/router/utils';

import { RouteEntry } from './utils';
import { getAllFiles } from './getAllFiles';

const html = '.html';

export default function createManifest(outDir: string) {
  const pagesPath = outDir || join(cwd(), 'out');
  const pages = getAllFiles(pagesPath);

  const routes = [
    ...pages
      .map((route): RouteEntry | null => {
        const dest = route.replace(pagesPath, '');

        if (!dest.endsWith(html)) return null;

        const src = dest.replace(html, '');
        const { re: regex } = getRouteRegex(src);

        return {
          src,
          dest,
          regex,
          dynamic: isDynamicRoute(src),
        };
      })
      .filter(Boolean),
    {
      dynamic: false,
      regex: getRouteRegex('/').re,
      src: '/',
      dest: 'index.html',
    },
  ];

  const sorted = routes.sort((a, b) => {
    const first = a as RouteEntry;
    const second = b as RouteEntry;

    return second.src.length - first.src.length;
  });

  if (sorted.some(k => k?.src === '/[...slug]')) {
    sorted.push(
      ...sorted.splice(
        sorted.findIndex(v => v?.src === '/[...slug]'),
        1
      )
    );
  }

  return sorted as Array<RouteEntry>;
}
