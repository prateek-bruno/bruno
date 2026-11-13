'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { generateManifest } = require('./generate.cjs');

const SOURCES_CACHE = path.join(__dirname, '..', '..', 'node_modules', '.cache', 'bruno-script-api', 'sources.json');

const readSources = () => {
  try {
    return JSON.parse(fs.readFileSync(SOURCES_CACHE, 'utf8'));
  } catch {
    return null;
  }
};

const hashSources = (sources) => {
  const hash = crypto.createHash('sha256');
  try {
    sources.forEach((file) => hash.update(file).update(fs.readFileSync(file)));
  } catch {
    return null;
  }
  return hash.digest('hex');
};

module.exports = {
  // The walk only reaches a file through an import in a file it already read, so hashing the last
  // run's sources changes whenever the manifest could.
  getCacheKey: () => {
    const sources = readSources();
    return (sources && hashSources(sources)) || crypto.randomUUID();
  },
  process: () => {
    const { manifest, sources } = generateManifest();
    fs.mkdirSync(path.dirname(SOURCES_CACHE), { recursive: true });
    fs.writeFileSync(SOURCES_CACHE, JSON.stringify(sources));
    return { code: `module.exports = { __esModule: true, default: ${JSON.stringify(manifest)} };` };
  }
};
