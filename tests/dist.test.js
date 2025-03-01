import { routes } from '../src/config/routes';
const { execSync } = require('child_process');

describe('Build distribution', () => {
  const outputDir = 'dist';

  it('should match a specific file output', () => {
    const output = execSync(`find ./${outputDir} -type f -print0 | xargs -0`);

    const replacedGeneratedFilesMinsHash = output
      .toString()
      .replace(/\s+|\n+|\r+/g, '')
      .replace(new RegExp(`./${outputDir}`, 'gi'), `~./${outputDir}`)
      .replace(new RegExp(`~./${outputDir}/.DS_Store`, 'gi'), '')
      .replace(new RegExp(`~./${outputDir}/(beta/|)config/main.yml`, 'gi'), '')
      .replace(/(?!^)\.[a-z0-9.]+\./gi, '*')
      .split('~')
      .sort();

    expect(replacedGeneratedFilesMinsHash).toMatchSnapshot();
  });

  it('should not contain references to localhost', () => {
    const output = execSync(`grep -roi "localhost:" ./${outputDir} | wc -l`).toString();

    expect(Number.parseInt(output.trim(), 10)).toBe(0);
  });

  it('should have a predictable ephemeral navigation based on route configuration', () => {
    const yamlFile = `./deploy/frontend.yaml`;
    const output = execSync(`yaml2json ${yamlFile}`);
    const yamlObj = JSON.parse(output.toString());
    const yamlRoutes = yamlObj.objects[0].spec.navItems[0].routes;

    expect(
      routes.map(({ path, productParameter }) => {
        const updatedRoute = { path, productParameter, coverage: 'FALSE' };
        const match = yamlRoutes.find(({ href }) => href.split('subscriptions')[1] === path);

        if (match) {
          updatedRoute.coverage = 'TRUE';
        }

        return updatedRoute;
      })
    ).toMatchSnapshot('expected covered, missing routes');
  });
});
