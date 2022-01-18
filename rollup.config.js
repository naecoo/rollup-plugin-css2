import esbuild from 'rollup-plugin-esbuild';
import { dependencies } from './package.json';
import { builtinModules } from 'module';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'dist/index.esm.js', format: 'esm' },
		{ file: 'dist/index.cjs.js', format: 'cjs', exports: 'default' }
	],
	plugins: [
		esbuild({
			target: 'es2015',
			minify: true
		})
	],
	external: builtinModules.concat(Object.keys(dependencies))
};