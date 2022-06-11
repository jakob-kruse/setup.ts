import {bundleRequire} from 'bundle-require';
import {PackageJsonSchema} from './types/package';

export function defineConfig(config: PackageJsonSchema) {
	return config;
}

export async function compilePackageTs(filePath: string): Promise<PackageJsonSchema> {
	const file = await bundleRequire({
		filepath: filePath,
	});

	if (!file.mod) {
		throw new Error('Could not import package.ts');
	}

	return file.mod.default as PackageJsonSchema;
}
