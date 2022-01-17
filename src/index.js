import { createFilter } from '@rollup/pluginutils';
import transformer from '@parcel/css';
import path from 'path';

const isString = (val) => typeof val === 'string';

const isFunction = (val) => typeof val === 'function';

const pluginGenerator = (options = {}) => {
	options = Object.assign(
		{
			include: ['**/*.css'],
			exclude: [],
			transformOptions: {
				minify: false,
				targets: {},
				drafts: {
					nesting: false
				}
			}
		},
		options
	);

	const filter = createFilter(options.include, options.exclude);
	const styles = new Map();
	const orders = new Set();

	return {
		name: 'css2',

		async transform(code, id) {
			if (!filter(id)) return;

			const { minify, targets, drafts } = options.transformOptions;

			const { code: transformCode } = await transformer.transform({
				code: Buffer.from(code),
				filename: id,
				minify,
				targets,
				drafts
			});

			const css = transformCode.toString();
			styles.set(id, css);
			if (!orders.has(id)) {
				orders.add(id);
			}

			return {
				code: `export default ${JSON.stringify(css)}`,
				map: { mappings: '' }
			};
		},

		generateBundle(opts) {
			let css = '';
			orders.forEach((id) => {
				css += styles.get(id) ?? '';
			});

			const { output } = options;

			if (isFunction(output)) {
				output(css, styles);
				return;
			}

			if (css.length <= 0 || !output) return;

			const name = isString(output) ? output.trim() : opts.file ?? 'bundle.js';
			const dest = path.basename(name, path.extname(name));
			if (dest) {
				this.emitFile({ type: 'asset', source: css, fileName: `${dest}.css` });
			}
		}
	};
};

export default pluginGenerator;
