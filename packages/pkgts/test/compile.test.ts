import {describe, it, expect} from 'vitest';
import {compilePackageTs} from '@';

describe('Compilation', () => {
	it('should compile', async () => {
		const fixturePath = 'test/fixtures/package.ts';
		const compiled = await compilePackageTs(fixturePath);
		console.log(compiled);

		expect(true).toBe(true);
	});
});
