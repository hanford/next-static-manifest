import parseCustomRoutes from '../src/parseCustomRoutes';

describe('reads next.config.js and respects rewrites fn', () => {
  it('generates RouteEntry from next.config.rewrites', async () => {
    const routes = await parseCustomRoutes(__dirname);

    expect(routes).toMatchSnapshot();
  });
});
