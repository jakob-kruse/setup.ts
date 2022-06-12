import { describe, it, expect } from 'vitest';
import { compile } from '@/setup';

describe('Compilation', () => {
  describe('basic', () => {
    it('should compile sync', async () => {
      const fixturePath = 'test/fixtures/compilation/basic.ts';
      const config = await compile(fixturePath);

      expect(config).toMatchSnapshot();
    });
  });

  describe('plugins', () => {
    it('should deep merge with the plugin result', async () => {
      const fixturePath = 'test/fixtures/compilation/plugin.ts';
      const config = await compile(fixturePath);

      expect(config).toMatchSnapshot();
    });

    it('should be chaining plugins', async () => {
      const fixturePath = 'test/fixtures/compilation/plugin-chaining.ts';
      const config = await compile(fixturePath);

      expect(config).toMatchSnapshot();
    });
  });
});
