const { join, resolve } = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const fedModulePlugin = require('@redhat-cloud-services/frontend-components-config/federated-modules');
const { setupWebpackDotenvFilesForEnv } = require('./build.dotenv');
const { dependencies } = require('../package.json');

const setReplacePlugin = () => [
  {
    pattern: /%([A-Z_]+)%/g,
    replacement: (match, $1) => process.env?.[$1] || match
  }
];

const setCommonPlugins = () => {
  const { NODE_ENV } = process.env;
  const DIST_DIR = process.env._BUILD_DIST_DIR;
  const DOTENV_ENV = process.env.REACT_APP_ENV;
  const RELATIVE_DIRNAME = process.env._BUILD_RELATIVE_DIRNAME;
  const SRC_DIR = process.env._BUILD_SRC_DIR;
  const STATIC_DIR = process.env._BUILD_STATIC_DIR;

  /**
   * FixMe: See PR, https://github.com/RedHatInsights/curiosity-frontend/pull/847
   * The module sharing for React Redux is a "fix" to let us upgrade to the latest platform hosted configs.
   * It should be determined why this is happening, and if we can resolve it from the Curiosity end.
   */
  const plugins = [
    ...setupWebpackDotenvFilesForEnv({ directory: RELATIVE_DIRNAME, env: DOTENV_ENV }),
    new CopyPlugin({
      patterns: [{ from: join(STATIC_DIR, 'locales'), to: join(DIST_DIR, 'locales'), noErrorOnMissing: true }]
    }),
    fedModulePlugin({
      root: RELATIVE_DIRNAME,
      shared: [{ 'react-redux': { requiredVersion: dependencies['react-redux'] } }]
    })
  ];

  // Development plugins
  if (NODE_ENV === 'development' || NODE_ENV === 'review') {
    plugins.push(
      new ESLintPlugin({
        context: SRC_DIR,
        failOnError: false
      })
    );
  }

  // Save 20kb of bundle size in prod
  if (NODE_ENV === 'production') {
    plugins.push(new webpack.NormalModuleReplacementPlugin(/redux-logger/, resolve(__dirname, './build.empty.js')));
  }

  return plugins;
};

module.exports = {
  setCommonPlugins,
  setReplacePlugin
};
