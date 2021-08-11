// const { NEXT_PUBLIC_PLAYGROUND_URL = 'foobar.com' } = process.env;
const NEXT_PUBLIC_PLAYGROUND_URL = 'http://foo.com';

module.exports = {
  async rewrites() {
    return [
      {
        source: '/playground',
        destination: `${NEXT_PUBLIC_PLAYGROUND_URL}/playground`,
      },
      {
        source: '/playground/:path*',
        destination: `${NEXT_PUBLIC_PLAYGROUND_URL}/playground/:path*`,
      },
    ];
  },
};
