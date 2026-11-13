'use strict';

const { execFile, execFileSync } = require('child_process');

const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const ARGS = ['run', '--silent', '--workspace=@usebruno/js', 'generate:script-api', '--', '--print-manifest'];
const OPTIONS = { cwd: __dirname, maxBuffer: 64 * 1024 * 1024, shell: process.platform === 'win32' };

const generateManifest = () => JSON.parse(execFileSync(NPM, ARGS, { ...OPTIONS, stdio: ['ignore', 'pipe', 'inherit'] }));

const generateManifestAsync = () => new Promise((resolve, reject) => {
  execFile(NPM, ARGS, OPTIONS, (error, stdout, stderr) => {
    if (error) reject(new Error(stderr || error.message));
    else resolve({ ...JSON.parse(stdout), warnings: stderr.trim() });
  });
});

module.exports = { generateManifest, generateManifestAsync };
