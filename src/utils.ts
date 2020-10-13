import fs from 'fs';
import path from 'path';

export interface RouteEntry {
  dynamic: boolean;
  src: string;
  dest: string;
  regex: RegExp;
}

const REGEX_KEY = '__REGEXP__:';

export function encode(routes: Array<RouteEntry>) {
  return JSON.stringify(routes, serialize);
}

export function decode(object: any) {
  return JSON.parse(object, deserialize);
}

function deserialize(_k: string, value: string) {
  if (value.toString().includes(REGEX_KEY)) {
    const m = value.split(REGEX_KEY)[1].match(/\/(.*)\/(.*)?/);

    if (!m) return value;

    return new RegExp(m[1], m[2] || '');
  } else {
    return value;
  }
}

function serialize(_: string, value: string | RegExp) {
  if (value instanceof RegExp) {
    return REGEX_KEY + value.toString();
  } else {
    return value;
  }
}

export function getAllFiles(dirPath: string, arrayOfFiles: Array<string> = []) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      if (file === '.DS_Store') return;

      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
}
