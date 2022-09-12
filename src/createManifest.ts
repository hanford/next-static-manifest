import { join } from 'path';
import { cwd } from 'process';
import {
  getRouteRegex,
  isDynamicRoute,
} from 'next/dist/shared/lib/router/utils';

import { RouteEntry } from './utils';
import { getAllFiles } from './getAllFiles';

const html = '.html';
const tsx = '.tsx';
const js = '.js';
const slashIndex = '/index';

const dynamicRouteRegex = /\/\[[^/]+?\](?=\/|$)/g;

export default function createManifest(dirPath: string) {
  const pagesPath = dirPath || join(cwd(), 'out');
  const pages = getAllFiles(pagesPath);

  const routes = [
    ...pages
      .map((route): RouteEntry | null => {
        let dest = route.replace(pagesPath, '');

        if (pagesPath !== 'pages' && !dest.endsWith(html)) return null;

        let src = dest
          .replace(html, '')
          .replace(tsx, '')
          .replace(js, '');

        if (src !== '/index') {
          src = src.replace(slashIndex, '');
          dest = dest.replace(slashIndex, '');
        }

        const { re: regex } = getRouteRegex(src);

        return {
          src,
          dest: dest.replace(tsx, html).replace(js, html),
          regex,
          dynamic: isDynamicRoute(src),
        };
      })
      .filter(Boolean),
    {
      dynamic: false,
      regex: getRouteRegex('/').re,
      src: '/',
      dest: '/index.html',
    },
  ];

  // Sort first sorts by whether or not the RouteEntry is dynamic
  // and additionally sorts by RouteEntry.src.length
  const sorted = routes.sort((a, b) => {
    const first = a as RouteEntry;
    const second = b as RouteEntry;

    // if both routes are dynamic, sort by amount of dynamic segments
    if (first.dynamic && first.dynamic === second.dynamic) {
      const firstAmountSegments = (first.src.match(dynamicRouteRegex) || [])
        .length;
      const secondAmountSegments = (second.src.match(dynamicRouteRegex) || [])
        .length;

      // if they don't have the same amount of dynamic segments
      if (firstAmountSegments !== secondAmountSegments) {
        return firstAmountSegments > secondAmountSegments ? 1 : -1;
      }
    }

    // if both have the same amount of dynamic segments OR aren't dynamic,
    // sort by length of 'src'
    if (first.dynamic === second.dynamic) {
      return second.src.length - first.src.length;
    }

    // Otherwise, move dynamic down and exact up
    if (first.dynamic) {
      return 1;
    } else {
      return -1;
    }
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
