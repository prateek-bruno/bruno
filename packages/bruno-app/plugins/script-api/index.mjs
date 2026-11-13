import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_MODULE = path.join(__dirname, 'manifest.js');

/**
 * Rsbuild plugin: serve `script-api-manifest` from the bruno-js JSDoc at build time, and rebuild it
 * whenever a file the generator read changes.
 * @returns {import('@rsbuild/core').RsbuildPlugin}
 */
export function pluginScriptApi() {
  return {
    name: 'plugin-script-api',
    setup(api) {
      api.modifyRspackConfig((config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = { ...config.resolve.alias, 'script-api-manifest$': MANIFEST_MODULE };
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];
        config.module.rules.push({
          resource: MANIFEST_MODULE,
          use: [{ loader: path.join(__dirname, 'loader.cjs') }]
        });
      });
    }
  };
}

export default pluginScriptApi;
