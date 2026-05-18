const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const { getCollectionGitRootPath } = require('../git');

const initRepo = (dir) => {
  execSync('git init -q', { cwd: dir });
};

const makeTempDir = () => {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'bruno-git-test-'));
};

describe('getCollectionGitRootPath', () => {
  let tempDirs = [];

  const track = (dir) => {
    tempDirs.push(dir);
    return dir;
  };

  afterEach(() => {
    for (const dir of tempDirs) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch (_) {}
    }
    tempDirs = [];
  });

  it('returns the repo path when the collection path is the git root itself', () => {
    const repoDir = track(fs.realpathSync(makeTempDir()));
    initRepo(repoDir);

    const result = getCollectionGitRootPath(repoDir);

    expect(result).toBe(path.normalize(repoDir) + path.sep);
  });

  it('returns the top-level repo path when the collection is nested inside it', () => {
    const repoDir = track(fs.realpathSync(makeTempDir()));
    initRepo(repoDir);

    const nestedCollectionPath = path.join(repoDir, 'a', 'b', 'collection');
    fs.mkdirSync(nestedCollectionPath, { recursive: true });

    const result = getCollectionGitRootPath(nestedCollectionPath);

    expect(result).toBe(path.normalize(repoDir) + path.sep);
  });

  it('returns null when the path is not inside a git repository', () => {
    const nonRepoDir = track(fs.realpathSync(makeTempDir()));

    const result = getCollectionGitRootPath(nonRepoDir);

    expect(result).toBeNull();
  });
});
