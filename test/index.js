const test = require('ava');
const { rollup } = require('rollup');
const path = require('path');
const css = require('..');

// helper
const resolve = (...args) => path.resolve(__dirname, ...args);
const build = async (inputOptions) => {
	const bundle = await rollup(inputOptions);
	const { output } = await bundle.generate({
		file: resolve('./dist/bundle.js'),
		format: 'esm',
		name: 'test'
	});

	return output;
};

test('options.output basic', async (t) => {
	const output = await build({
		input: resolve('./entrys/1.js'),
		plugins: [
			css({
				output: 'bundle'
			})
		]
	});
	t.is(output.length, 2);
	t.is(output[0].code, `const name = 'test';\n\nexport { name };\n`);
	t.is(
		output[1].source,
		`body {\n  margin: 0;\n}\n\na {\n  text-decoration: none;\n}\n`
	);
	t.is(output[1].fileName, 'bundle.css');
});

test('options.output is falsy', async (t) => {
	const output = await build({
		input: resolve('./entrys/1.js'),
		plugins: [
			css({
				output: false
			})
		]
	});
	t.is(output.length, 1);
});

test('options.output is other type except string', async (t) => {
	const output = await build({
		input: resolve('./entrys/1.js'),
		plugins: [
			css({
				output: 123
			})
		]
	});
	t.is(output.length, 2);
	t.is(output[1].fileName, 'bundle.css');
});

test('options.output is function', async (t) => {
	const outputFunction = (css, styles) => {
		t.is(css, 'body {\n  margin: 0;\n}\n\na {\n  text-decoration: none;\n}\n');
		t.true(styles instanceof Map);
		t.is(styles.size, 1);
	};

	await build({
		input: resolve('./entrys/1.js'),
		plugins: [
			css({
				output: outputFunction
			})
		]
	});
	t.pass();
});

test('options.include basic', async (t) => {
	const output = await build({
		input: resolve('./entrys/2.js'),
		plugins: [
			css({
				output: 'bundle.css'
			})
		]
	});
	t.is(output.length, 2);
	t.true(output[1].source.indexOf('padding') > -1);
	t.true(output[1].source.indexOf('margin') > -1);
});

test('options.include except 2.css', async (t) => {
	try {
		await build({
			input: resolve('./entrys/2.js'),
			plugins: [
				css({
					include: ['*/**/1.css'],
					output: 'bundle.css'
				})
			]
		});
	} catch (e) {
		t.true(e.id.indexOf('1.css') === -1);
		t.true(e.id.indexOf('2.css') > -1);
	}
});

test('options.exclude', async (t) => {
	try {
		await build({
			input: resolve('./entrys/2.js'),
			plugins: [
				css({
					exclude: ['**/styles/**'],
					output: 'bundle.css'
				})
			]
		});
	} catch (e) {
		t.is(e.code, 'PARSE_ERROR');
	}
});

test('options.transformOptions.minify', async (t) => {
	const output = await build({
		input: resolve('./entrys/1.js'),
		plugins: [
			css({
				output: 'bundle.css',
				transformOptions: {
					minify: true
				}
			})
		]
	});
	t.is(output.length, 2);
	t.is(output[1].source, 'body{margin:0}a{text-decoration:none}');
});

test('import css module', async (t) => {
	const output = await build({
		input: resolve('./entrys/4.js'),
		plugins: [
			css({
				transformOptions: {
					minify: true
				}
			})
		]
	});
	t.is(output.length, 1);
	t.is(
		output[0].code,
		`var styles = "body{margin:0}a{text-decoration:none}";\n\nexport { styles as default };\n`
	);
});
