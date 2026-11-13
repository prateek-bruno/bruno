'use strict';

const { generateManifestAsync } = require('./generate.cjs');

module.exports = function scriptApiManifestLoader() {
  const callback = this.async();
  generateManifestAsync().then(({ manifest, sources, warnings }) => {
    sources.forEach((file) => this.addDependency(file));
    if (warnings) this.emitWarning(new Error(warnings));
    callback(null, `export default ${JSON.stringify(manifest)};`);
  }, callback);
};
