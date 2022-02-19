/* eslint-disable @typescript-eslint/no-unused-vars */
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

/**
 * Function that mutates the original webpack config.
 * Supports asynchronous changes when a promise is returned (or it's an async function).
 *
 * @param {import('preact-cli').Config} config - original webpack config
 * @param {import('preact-cli').Env} env - current environment and options pass to the CLI
 * @param {import('preact-cli').Helpers} helpers - object with useful helpers for working with the webpack config
 * @param {Record<string, unknown>} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
 */
export default (config, env, helpers) => {
  // CHANGE CLASS NAMES
  const css = helpers.getLoadersByName(config, 'css-loader')[0];
  css.loader.options.modules.localIdentName = '[hash:base64:7]';

  // COPY THE ROOT OF "/src/assets" INTO THE BUILD FOLDER (not folders)
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [{ from: '*', context: path.resolve(__dirname, 'src/assets') }],
    }),
  );
};
