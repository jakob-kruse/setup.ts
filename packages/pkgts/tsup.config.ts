import {defineConfig} from 'tsup';

export default defineConfig(options => ({
	entry: ['src/index.ts', 'src/cli.ts'],
	minify: !options.watch,
	splitting: false,
	sourcemap: true,
	clean: true,
}));
