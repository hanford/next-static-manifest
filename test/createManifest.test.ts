import { join } from 'path';
import createManifest from '../src/createManifest';
import { encode, decode, RouteEntry } from '../src/utils';

const out = join(__dirname, 'out');

describe('create manifest scans ./out directory and creates manifest', () => {
  it('returns manifest', () => {
    expect(createManifest(out)).toMatchSnapshot();
  });

  it('encodes manifest', () => {
    const encoded = encode(createManifest(out));

    expect(encoded).toMatchSnapshot();
  });

  it('decodes manifest', () => {
    const decoded = decode(encode(createManifest(out)));

    expect(decoded).toMatchSnapshot();
  });

  it('encoded decoded regex works', () => {
    const decoded = decode(encode(createManifest(out)));
    const postUrl = '/blog/posts/420';

    expect(decoded.findIndex((v: RouteEntry) => postUrl.match(v.regex))).toBe(
      5
    );
  });
});
