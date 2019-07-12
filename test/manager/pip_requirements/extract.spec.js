const fs = require('fs');
const {
  extractPackageFile,
} = require('../../../lib/manager/pip_requirements/extract');

const requirements1 = fs.readFileSync(
  'test/manager/pip_requirements/_fixtures/requirements1.txt',
  'utf8'
);
const requirements2 = fs.readFileSync(
  'test/manager/pip_requirements/_fixtures/requirements2.txt',
  'utf8'
);
const requirements3 = fs.readFileSync(
  'test/manager/pip_requirements/_fixtures/requirements3.txt',
  'utf8'
);

const requirements4 = fs.readFileSync(
  'test/manager/pip_requirements/_fixtures/requirements4.txt',
  'utf8'
);

const requirements5 = fs.readFileSync(
  'test/manager/pip_requirements/_fixtures/requirements5.txt',
  'utf8'
);

describe('lib/manager/pip_requirements/extract', () => {
  describe('extractPackageFile()', () => {
    let config;
    beforeEach(() => {
      config = {};
    });
    it('returns null for empty', () => {
      expect(extractPackageFile('nothing here', config)).toBeNull();
    });
    it('extracts dependencies', () => {
      const res = extractPackageFile(requirements1, config);
      expect(res).toMatchSnapshot();
      expect(res.registryUrls).toEqual(['http://example.com/private-pypi/']);
      expect(res.deps).toHaveLength(3);
    });
    it('extracts multiple dependencies', () => {
      const res = extractPackageFile(requirements2, config).deps;
      expect(res).toMatchSnapshot();
      expect(res).toHaveLength(5);
    });
    it('handles comments and commands', () => {
      const res = extractPackageFile(requirements3, config).deps;
      expect(res).toMatchSnapshot();
      expect(res).toHaveLength(5);
    });
    it('handles extras and complex index url', () => {
      const res = extractPackageFile(requirements4, config);
      expect(res).toMatchSnapshot();
      expect(res.registryUrls).toEqual([
        'https://artifactory.company.com/artifactory/api/pypi/python/simple',
      ]);
      expect(res.deps).toHaveLength(3);
    });
    it('handles extra index url', () => {
      const res = extractPackageFile(requirements5, config);
      expect(res).toMatchSnapshot();
      expect(res.registryUrls).toEqual([
        'https://artifactory.company.com/artifactory/api/pypi/python/simple',
        'http://example.com/private-pypi/',
      ]);
      expect(res.deps).toHaveLength(6);
    });
  });
});
