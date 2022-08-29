import * as fs from 'fs';
import { join } from 'path';
import { argv } from 'yargs';

import createManifest from './createManifest';
import { encode } from './utils';

const outDir = (argv.outDir as string) || 'out';
const inDir = (argv.inDir as string) || 'out';
const fileName = (argv.fileName as string) || 'next-static-manifest';

const entryManifest = join(outDir, `${fileName}.json`);

const routes = createManifest(inDir || outDir);

fs.writeFile(entryManifest, encode(routes), function(err) {
  if (err) throw err;

  console.log('Next.js static manifest created');
  return;
});
