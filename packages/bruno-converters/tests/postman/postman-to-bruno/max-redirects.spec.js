import { describe, it, expect } from '@jest/globals';
import postmanToBruno from '../../../src/postman/postman-to-bruno';
import { makeCollection, makeRequest } from '../../common/postman-collection';

const importPostmanRequestWithMaxRedirects = async (maxRedirects) => {
  const { collection, issues } = await postmanToBruno(
    makeCollection([makeRequest('Req', { protocolProfileBehavior: { maxRedirects } })])
  );
  return { settings: collection.items[0].settings, issues };
};

describe('postman maxRedirects import', () => {
  it.each([0, 50, 51, 1000])('should preserve a maxRedirects of %i', async (maxRedirects) => {
    const { settings, issues } = await importPostmanRequestWithMaxRedirects(maxRedirects);

    expect(settings.maxRedirects).toBe(maxRedirects);
    expect(issues).toHaveLength(0);
  });

  it.each([{ followRedirects: true }, undefined])(
    'should leave maxRedirects unset for protocolProfileBehavior %p',
    async (protocolProfileBehavior) => {
      const { collection } = await postmanToBruno(makeCollection([makeRequest('Req', { protocolProfileBehavior })]));

      expect(collection.items[0].settings).not.toHaveProperty('maxRedirects');
    }
  );

  it.each([-1, 3.5, '100', 'abc', '', true, [], NaN, Infinity])(
    'should drop a maxRedirects of %p and warn instead of failing the import',
    async (maxRedirects) => {
      const { settings, issues } = await importPostmanRequestWithMaxRedirects(maxRedirects);

      expect(settings).not.toHaveProperty('maxRedirects');
      expect(issues).toHaveLength(1);
      expect(issues[0]).toMatchObject({
        path: 'Req',
        severity: 'warning',
        message: expect.stringContaining('maxRedirects')
      });
    }
  );

  it('should drop a null maxRedirects without raising an issue', async () => {
    const { settings, issues } = await importPostmanRequestWithMaxRedirects(null);

    expect(settings).not.toHaveProperty('maxRedirects');
    expect(issues).toHaveLength(0);
  });

  it('should import every sibling and report one issue per offending request', async () => {
    const { collection, issues } = await postmanToBruno(
      makeCollection([
        makeRequest('First Offender', { protocolProfileBehavior: { maxRedirects: -1 } }),
        makeRequest('Fine', { protocolProfileBehavior: { maxRedirects: 10 } }),
        makeRequest('Second Offender', { protocolProfileBehavior: { maxRedirects: 'nope' } })
      ])
    );

    expect(collection.items.map((item) => item.name)).toEqual(['First Offender', 'Fine', 'Second Offender']);
    expect(issues.map((issue) => issue.path)).toEqual(['First Offender', 'Second Offender']);
  });
});
